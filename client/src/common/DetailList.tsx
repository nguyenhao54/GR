function DetailList(props: any) {
    const { list } = props
    return (
        <div className='flex flex-col gap-2'>
            {
                list.map((item: { title: string, text: string }) =>
                    <div className='flex flex-row gap-[2px] items-stretch'>
                        <div className='bg-neutral-200 p-2 w-32 text-wrap font-medium'>{item.title}</div>
                        <div className='p-2'>{item.text}</div>
                    </div>
                )
            }
        </div>
    )
}

export default DetailList