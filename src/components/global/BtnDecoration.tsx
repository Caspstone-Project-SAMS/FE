import React from 'react'
import styles from './index.module.less'

import { Button } from 'antd'
import Title from 'antd/es/typography/Title'

type props = {
    btnTitle: string,
    btnFuncName: string,
    imgDecor: string
}

const BtnDecoration: React.FC<props> = ({ btnFuncName, btnTitle, imgDecor }) => {
    return (
        <Button className={styles.btnDecorationCtn}>
            <div className={styles.btnInfo}>
                {btnTitle ? (
                    <Title level={4}>{btnTitle}</Title>
                ) : ('')}
                <span className={styles.btnFuncName}>{btnFuncName}</span>
            </div>
            <hr className={styles.verticalLine} />
            <div className={styles.iconDecorCtn}>
                <img src={imgDecor} className={styles.iconDecor} />
            </div>
        </Button>
    )
}

export default BtnDecoration
