
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex justify-between items-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">

      <div>
        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div className={`${color} p-4 rounded-lg text-white`}>
        {Icon && <Icon size={24} />}
      </div>

    </div>
  );
}

export default StatCard;