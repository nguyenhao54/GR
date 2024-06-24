import formats from './toolbarOptions';

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