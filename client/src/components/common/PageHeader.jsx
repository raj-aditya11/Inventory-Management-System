function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-slate-800">
        {title}
      </h1>

      {subtitle && (
        <p className="text-slate-500 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeader;