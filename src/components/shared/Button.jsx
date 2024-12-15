import { useMemo } from "react";
import { buttonType } from "../../constants/buttonType";

const defaultStyle = 'p-2 rounded';

export default function Button(props) {
  const { title, handleClick, classes, variant } = props;

  const buttonStyle = useMemo(() => {
    const typeComputed = variant || buttonType.gray;

    switch (typeComputed) {
      case buttonType.red: {
        return 'bg-red-500 text-white hover:bg-red-600';
      }
      case buttonType.blue: {
        return 'bg-blue-500 text-white hover:bg-blue-600';
      }
      case buttonType.green: {
        return 'bg-green-500 text-white hover:bg-green-600';
      }
      case buttonType.gray: {
        return 'bg-gray-300 text-black hover:bg-gray-400';
      }
    }
  }, [variant]);

  return (
    <button 
      className={`${defaultStyle} ${classes} ${buttonStyle}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
}