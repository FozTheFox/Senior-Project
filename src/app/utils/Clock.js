import React from "react";

const Clock = () => {
  const [CT, setCT] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCT(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div>{CT.toLocaleTimeString()}</div>;
};

export default Clock;
