const db = require("../config/db");

exports.getAdminDashboard = async (req, res) => {

    try {

        const [
            users,
            groups,
            inventory,
            transfers,
            disposals,
            holders,
            activeUsers,
            history,
        ] = await Promise.all([

            db.query(`
                SELECT COUNT(*) AS total
                FROM users
                WHERE is_deleted = 'no'
            `),

            db.query(`
                SELECT COUNT(*) AS total
                FROM \`groups\`
                WHERE is_deleted = 'no'
            `),

            db.query(`
                SELECT COUNT(*) AS total
                FROM inventory
                WHERE is_deleted = 'no'
            `),

            db.query(`
                SELECT COUNT(*) AS total
                FROM transfer_requests
                WHERE
                    status = 1
                    AND is_deleted = 'no'
            `),

            db.query(`
                SELECT COUNT(*) AS total
                FROM asset_disposal
                WHERE is_deleted = 'no'
            `),

            db.query(`
                SELECT COUNT(*) AS total
                FROM users
                WHERE
                    role = 'INVENTORY_HOLDER'
                    AND is_deleted = 'no'
            `),

            db.query(`
                SELECT COUNT(*) AS total
                FROM users
                WHERE
                    status = 1
                    AND is_deleted = 'no'
            `),

            db.query(`
                SELECT
                    ah.action,
                    ah.quantity,
                    ah.remarks,
                    ah.created_at,

                    i.ledger_number,
                    i.unit, 

                    a.asset_name,

                    COALESCE(
                        CONCAT(
                            u.first_name,
                            ' ',
                            COALESCE(u.last_name, '')
                        ),
                        'System'
                    ) AS performed_by

                FROM asset_history ah

                LEFT JOIN inventory i
                    ON ah.inventory_id = i.inventory_id

                LEFT JOIN assets a
                   ON i.asset_id = a.asset_id

                LEFT JOIN users u
                    ON ah.performed_by = u.id

                ORDER BY ah.created_at DESC

                LIMIT 10
            `)

        ]);

        return res.status(200).json({

            success: true,

            stats: {

                totalUsers: users[0][0].total,

                totalGroups: groups[0][0].total,

                totalInventory: inventory[0][0].total,

                pendingTransfers: transfers[0][0].total,

                totalDisposals: disposals[0][0].total,

                inventoryHolders: holders[0][0].total,

                activeUsers: activeUsers[0][0].total,

            },

            recentActivity: history[0],

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};

exports.getInventoryHolderDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        // Find the Inventory Holder's group
        const [holder] = await db.query(
            `
            SELECT
                id,
                group_id
            FROM users
            WHERE
                id = ?
                AND role = 'INVENTORY_HOLDER'
                AND is_deleted = 'no'
            `,
            [userId]
        );

        if (holder.length === 0) {

            return res.status(403).json({
                success: false,
                message: "Inventory Holder not found.",
            });

        }

        const groupId = holder[0].group_id;

        if (groupId == null) {

            return res.status(400).json({
                success: false,
                message: "Inventory Holder is not assigned to a group.",
            });

        }

        const [
            inventory,
            availableStock,
            transfers,
            disposals,
            history,
        ] = await Promise.all([

            // Total inventory records belonging to this group
            db.query(
                `
                SELECT COUNT(*) AS total
                FROM inventory i

                INNER JOIN users u
                    ON i.received_by = u.id

                WHERE
                    u.group_id = ?
                    AND i.is_deleted = 'no'
                `,
                [groupId]
            ),

            // Total available quantity
            db.query(
                `
                SELECT
                    COALESCE(
                        SUM(i.quantity_available),
                        0
                    ) AS total

                FROM inventory i

                INNER JOIN users u
                    ON i.received_by = u.id

                WHERE
                    u.group_id = ?
                    AND i.is_deleted = 'no'
                `,
                [groupId]
            ),

            // Pending transfer requests requiring this group's
            // Inventory Holder's approval
            db.query(
                `
                SELECT COUNT(*) AS total

                FROM transfer_requests tr

                INNER JOIN users ru
                    ON tr.requested_by = ru.id

                WHERE
                    ru.group_id = ?
                    AND tr.same_group_transfer IN ('yes', 'no')
                    AND tr.source_holder_status = 0
                    AND tr.is_deleted = 'no'
                `,
                [groupId]
            ),

            // Disposal records belonging to this group
            db.query(
                `
                SELECT COUNT(*) AS total

                FROM asset_disposal ad

                INNER JOIN users u
                    ON ad.disposed_by = u.id

                WHERE
                    u.group_id = ?
                    AND ad.is_deleted = 'no'
                `,
                [groupId]
            ),

            // Recent activity for this group's assets
            db.query(
                `
                SELECT
                    ah.action,
                    ah.quantity,
                    ah.remarks,
                    ah.created_at,

                    i.ledger_number,
                    i.unit,

                    a.asset_name

                FROM asset_history ah

                LEFT JOIN inventory i
                    ON ah.inventory_id = i.inventory_id

                LEFT JOIN assets a
                    ON i.asset_id = a.asset_id

                LEFT JOIN users u
                    ON ah.performed_by = u.id

                WHERE
                    u.group_id = ?

                ORDER BY ah.created_at DESC

                LIMIT 10
                `,
                [groupId]
            ),

        ]);

        return res.status(200).json({

            success: true,

            stats: {

                totalAssets:
                    inventory[0][0].total,

                availableStock:
                    availableStock[0][0].total,

                pendingTransfers:
                    transfers[0][0].total,

                disposals:
                    disposals[0][0].total,

            },

            recentActivity: history[0],

        });

    } catch (error) {

        console.error(
            "Inventory Holder Dashboard Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};

exports.getUserDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const [
            assignedAssets,
            pendingTransfers,
            disposals,
            approvedTransfers,
            history,
        ] = await Promise.all([

            // Currently assigned assets
            db.query(
                `
                SELECT
                    COALESCE(SUM(quantity), 0) AS total
                FROM asset_assignment
                WHERE
                    user_id = ?
                    AND is_deleted = 'no'
                `,
                [userId]
            ),

            // Pending transfer requests created by the user
            db.query(
                `
                SELECT COUNT(*) AS total
                FROM transfer_requests
                WHERE
                    requested_by = ?
                    AND status = 1
                    AND is_deleted = 'no'
                `,
                [userId]
            ),

            // Total disposals made by the user
            db.query(
                `
                SELECT COUNT(*) AS total
                FROM asset_disposal
                WHERE
                    disposed_by = ?
                    AND is_deleted = 'no'
                `,
                [userId]
            ),

            // Approved transfer requests created by the user
            db.query(
                `
                SELECT COUNT(*) AS total
                FROM transfer_requests
                WHERE
                    requested_by = ?
                    AND status = 2
                    AND is_deleted = 'no'
                `,
                [userId]
            ),

            // Recent activity performed by the user
            db.query(
                `
                SELECT
                    ah.action,
                    ah.quantity,
                    ah.remarks,
                    ah.created_at,
                    i.ledger_number,
                    i.unit,
                    a.asset_name

                FROM asset_history ah

                LEFT JOIN inventory i
                    ON ah.inventory_id = i.inventory_id

                LEFT JOIN assets a
                    ON i.asset_id = a.asset_id

                WHERE
                    ah.performed_by = ?

                ORDER BY ah.created_at DESC

                LIMIT 10
                `,
                [userId]
            ),

        ]);

        return res.status(200).json({

            success: true,

            stats: {

                assignedAssets:
                    assignedAssets[0][0].total,

                pendingTransfers:
                    pendingTransfers[0][0].total,

                disposals:
                    disposals[0][0].total,

                approvedTransfers:
                    approvedTransfers[0][0].total,

            },

            recentActivity: history[0],

        });

    } catch (error) {

        console.error(
            "User Dashboard Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Internal Server Error",

        });

    }

};