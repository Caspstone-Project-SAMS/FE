import { Typography } from 'antd'
import React from 'react'
import styles from './index.module.less'

interface Props {
    contentTitle: string,
    previousBreadcrumb: string | undefined,
    currentBreadcrumb: string | undefined
}

const ContentHeader: React.FC<Props> = (props) => {
    const { contentTitle, previousBreadcrumb, currentBreadcrumb } = props;

    return (
        <div className={styles.contentHeader}>
            <Typography.Title style={{ marginBottom: '10px' }} className={styles.contentTitle}>
                {contentTitle}
            </Typography.Title>
            {
                (previousBreadcrumb || currentBreadcrumb) ? (
                    <div className={styles.breadcrumbCtn}>
                        <span className='previousBreadcrumb'>{previousBreadcrumb}</span>
                        <b className="currentBreadcrumb">{currentBreadcrumb}</b>
                    </div>
                ) : ('')
            }
        </div>
    )
}

export default ContentHeader