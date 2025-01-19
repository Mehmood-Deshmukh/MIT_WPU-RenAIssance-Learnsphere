import PuffLoader from "react-spinners/PuffLoader";

const Spinner = () => {
  return (
    <div>
      <PuffLoader
        color="blue"
        loading={true}
        size={150}
        className="w-fit mx-auto"
      />
    </div>
  );
};

export default Spinner;
