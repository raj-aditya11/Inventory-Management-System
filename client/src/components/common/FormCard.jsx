function FormCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">

      {title && (
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          {title}
        </h2>
      )}

      {children}

    </div>
  );
}

export default FormCard;