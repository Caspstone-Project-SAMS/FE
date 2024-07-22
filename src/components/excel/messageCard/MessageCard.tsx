import React, { useState } from 'react'
import styles from '../index.module.less'
import '../../../assets/styles/styles.less';
import { CheckCircleOutlined, DownOutlined, EnterOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion';

type InfoLog = {
    messages: string[],
    type: 'success' | 'warning' | 'error'
}

type Message = {
    message: string
    type: 'warning' | 'error' | 'success',
}

const MessageCard: React.FC<{ props: Message[], title?: string }> = ({ props, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const msgLength = props.length
    const type = props[0]?.type || 'success';

    const handleChangeLog = () => {
        setIsOpen(!isOpen)
    }

    const msgType = {
        success: {
            message: 'Excel file good to go!',
            icon: <CheckCircleOutlined size={20} />,
            color: '#24D164',
            bgColor: '#FFF'
        },
        warning: {
            message: 'Excel file should adjust a few point',
            icon: <InfoCircleOutlined size={20} />,
            color: '#EAAD0D',
            bgColor: '#FEF5DF'
        },
        error: {
            message: 'Error has occurred',
            icon: <ExclamationCircleOutlined size={20} />,
            color: '#fd3d3e',
            bgColor: '#ffefef'
        }
    }

    return (
        <div className={styles.msgCardCtn}>
            {
                <div className={styles.msgTitle}
                    style={{
                        backgroundColor: msgType[type].bgColor,
                        color: msgType[type].color,
                        border: `1px solid ${msgType[type].color}`
                    }}>
                    {
                        msgLength > 0 ? (
                            <>
                                <div className={'flex item-center'} >
                                    <span className={styles.msgIcon}>{msgType[type].icon}</span>
                                    {
                                        type === 'error' ? (
                                            `${msgLength} errors has occurred`
                                        ) : (
                                            type === 'warning' ? (
                                                `${msgLength} warning, adjust file for better result`
                                            ) : (
                                                title ? (title) : (
                                                    msgLength > 0 ? ('Created successfully') : ('Excel file good to go!')
                                                )
                                            )
                                        )
                                    }
                                </div>
                                <motion.div
                                    whileInView={{
                                        rotate: isOpen ? (0) : (-90),
                                    }}
                                >
                                    <DownOutlined onClick={() => handleChangeLog()} style={{ color: 'black' }} color='#FFFFFF' />
                                </motion.div>
                            </>
                        ) : (
                            <div className={'flex item-center'} >
                                <span className={styles.msgIcon}>{msgType[type].icon}</span>
                                Excel file good to go!
                            </div>
                        )
                    }
                </div>
                // )
            }

            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0.4, y: -30 }}
                        exit={{ opacity: 0.4, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: "easeInOut" }}
                        className={styles.msgContents}
                    >
                        <MsgRecord
                            messages={props.map(item => item.message)}
                            type={type}
                        />
                    </motion.div>
                ) : ('')
                }
            </AnimatePresence>

        </div>
    )
}

export default MessageCard;

const MsgRecord: React.FC<InfoLog> = ({ messages, type }) => {
    const msgType = {
        success: {
            color: '#24D164',
            backgroundColor: '#daffe7',
            border: '1px solid #24D164'
        },
        warning: {
            color: '#EAAD0D',
            backgroundColor: '#FFF9EA',
            border: '1px solid #FBBF24'
        },
        error: {
            color: '#FD3D3E',
            backgroundColor: '#FFFAFA',
            border: '1px solid #FD3D3E'
        }
    }
    const recordStyle = msgType[type]

    return (
        <div className={styles.msgRecordCtn}
            style={recordStyle}>
            {messages.map((item, i) => (
                <div key={`msgRecord-${i}`} className={styles.recordItem}>
                    <EnterOutlined className={styles.msgRecordIcon} />
                    <p className={styles.msgRecordTxt}>{item}</p>
                </div>
            ))}
        </div>
    )
}