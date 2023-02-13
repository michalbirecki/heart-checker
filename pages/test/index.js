import React from "react";

const Index = () => {
  //   const url = "https://heart-checker.vercel.app/api/checker";
  const url = "http://localhost:3000/api/checker";
  return (
    <button
      onClick={() => {
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Ricard",
            age: 30,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
      }}
    >
      {" "}
      Button Test
    </button>
  );
};

export default Index;
