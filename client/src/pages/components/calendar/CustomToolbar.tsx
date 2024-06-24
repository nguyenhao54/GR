import React from "react"
import formats from './toolbarOptions';

const renderOptions = (formatData: any) => {
    const { className, options } = formatData;
    return (
        <select className={className}>
            <option selected={true}></option>
            {
                options.map((value: any) => {
                    return (
                        <option value={value}></option>
                    )
                })
            }
        </select>
    )
}
const renderSingle = (formatData: any) => {
    const { className, value } = formatData;
    return (
        <button className={className} value={value}></button>
    )
}
const CustomToolbar = () => (
    <div id="toolbar">
        {
            formats.map(classes => {
                return (
                    <span className="ql-formats">
                        {
                            classes.map(formatData => {
                                return renderSingle(formatData)
                            })
                        }
                    </span>
                )
            })
        }
    </div>
)
export default CustomToolbar;