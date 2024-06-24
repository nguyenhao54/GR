import React from "react";

export default function ToolTipOnHover({
  textContent,
  limit,
  children
}: {
  textContent: string;
  limit: number;
  children?: JSX.Element
}) {
  const [show, setShow] = React.useState(false);
  const hasToolTip = textContent?.length > limit;
  return (
    <div className="relative font-nunitoSans w-full">
      <div
        className={"w-full flex text-left justify-start cursor-default"}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {hasToolTip ? children ? children : `${textContent.slice(0, limit)}...` : textContent}
      </div>
      {show && hasToolTip && (
        <div className="absolute bottom-6 z-99 -left-4 inline-block p-2 text-xs font-medium rounded-md shadow-sm text-white bg-slate-900 min-w-210 w-max">
          {textContent}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}
    </div>
  );
}