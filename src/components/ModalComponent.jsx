import React from "react";

const iconClose = (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    className="stroke-black"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15.73" y1="15.66" x2="8.66" y2="8.59" />
    <line x1="8.66" y1="15.66" x2="15.73" y2="8.59" />
  </svg>
);

const ModalComponent = ({ show, title, children, onClose }) => {
  return (
    <div
      className={
        show
          ? "z-10 backdrop-opacity-10 backdrop-invert bg-black/30 min-h-screen fixed bottom-0 left-0 w-full flex flex-col justify-center"
          : "hidden"
      }
    >
      <div className="bg-white mx-auto md:w-1/2 xs:w-80 my-12 p-5 rounded-xl">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-bold text-xl m-2">{title}</h1>
          <button className="h-fit" onClick={onClose}>
            {iconClose}
          </button>
        </div>
        <div className="mb-5 overflow-y-auto max-h-[28rem]">{children}</div>
      </div>
    </div>
  );
};

export default ModalComponent;
