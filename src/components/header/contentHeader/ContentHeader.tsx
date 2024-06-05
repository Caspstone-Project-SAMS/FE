import { Space, Typography } from 'antd'
import React from 'react'
import './index.less'

interface Props {
    contentTitle: string,
    previousBreadcrumb: string | undefined,
    currentBreadcrumb: string | undefined
}

const ContentHeader: React.FC<Props> = (props) => {
    const { contentTitle, previousBreadcrumb, currentBreadcrumb } = props;

    return (
        <div className='content-header'>
            <Typography.Title level={2}>{contentTitle}</Typography.Title>
            {
                (previousBreadcrumb || currentBreadcrumb) ? (
                    <Space size={'small'} className='breadcrumb-ctn' direction="horizontal">
                        <span className='previousBreadcrumb'>{previousBreadcrumb}</span>
                        <b className="currentBreadcrumb">{currentBreadcrumb}</b>
                    </Space>
                ) : ('')
            }
        </div>
    )
}

export default ContentHeader