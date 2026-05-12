import React, { useState } from "react";
import md5 from "md5";

const Avatar = ({ email, firstname, lastname }) => {
  const [imgError, setImgError] = useState(false);

  const hash = md5(email.trim().toLowerCase());
  const imageUrl = `https://www.gravatar.com/avatar/${hash}?d=404`;

  const getInitials = () => {
    return `${firstname[0] || ""}${lastname[0] || ""}`.toUpperCase();
  };

  return (
    <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold overflow-hidden">
      {!imgError && email ? (
        <img
          src={imageUrl}
          alt="avatar"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
};

export default Avatar;