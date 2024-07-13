import styles from './index.module.less'
import '../../../assets/styles/styles.less'

import React from 'react'
import ContentHeader from '../../../components/header/contentHeader/ContentHeader'
import Excel from '../../../components/excel/Excel'

const AdminSchedule = () => {
    return (
        <div className={styles.adminScheduleCtn}>
            <div className='align-center-between'>
                <ContentHeader
                    contentTitle="Schedule"
                    previousBreadcrumb={'Home / '}
                    currentBreadcrumb={'Schedule'}
                    key={''}
                />
                <Excel fileType='schedule' />
            </div>

        </div>
    )
}

export default AdminSchedule