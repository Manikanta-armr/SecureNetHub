import React from 'react';

function SidebarOptions({ onClick, Icon, text }) {
  return (
    <>
    <div className="SidebarOptions" onClick={onClick}>
      <Icon />
      <h2>{text}</h2>
    </div>
    </>
  );
}

export default SidebarOptions;
