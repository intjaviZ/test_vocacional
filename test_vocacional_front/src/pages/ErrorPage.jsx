const ErrorPage = ({ mensaje }) => {
  const words = mensaje.split(" ");

  return (
    <div className=" w-full flex-grow flex items-center justify-center px-10 lg:px-24 2xl:px-64">
      <h1 className="font-light text-2xl xl:text-4xl 2xl:text-6xl uppercase text-justify">
        {words.map((word, id) => (
          <span
            key={id}
            className="inline-block opacity-0 animate-fadeIn transition-opacity duration-200"
            style={{ animationDelay: `${id * 150}ms` }}
          >
            {word}&nbsp;
          </span>
        ))}
      </h1>
    </div>
  );
};

export default ErrorPage;
