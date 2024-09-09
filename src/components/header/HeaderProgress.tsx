import { Button, Card, List, Modal, Progress, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { SessionServive } from '../../hooks/Session';
import './spin.css'

interface PreparationProgress {
  SessionId: number;
  Progress: number;
}

interface NotificationListt {
  notificationID: number;
  title: string;
  description: string;
  timeStamp: string;
  read: boolean;
  notificationType: NotificationTypee;
  user: null;
}

interface NotificationTypee {
  notificationTypeID: number;
  typeName: string;
  typeDescription: string;
  notifications: [];
}

interface HeaderProps {
  preparationProgress?: PreparationProgress | null;
  newNotificaton?: NotificationListt | null;
}

interface Sessions {
  sessionId: number;
  userID: string;
  category: number;
  timeStamp: string;
  sessionState: number;
  durationInMin: number;
  moduleId: number;
  title: string;
  fingerRegistration: null;
  fingerUpdate: null;
  prepareAttendance: {
    preparedSchedules: [];
    preparedDate: null;
    scheduleId: number;
    progress: number;
    totalWorkAmount: number;
    completedWorkAmount: number;
    totalFingers: number;
  };
  errors: [];
}

const HeaderProgress: React.FC<HeaderProps> = ({ preparationProgress, newNotificaton }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listSessionData, setListSessionData] = useState<Sessions[]>([]);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchSessionById = useCallback(
    async (sessionId: number) => {
      try {
        const response = await SessionServive.getSessionByID(sessionId);
        if (response !== null) {
          // Check if the sessionId already exists in the list
          const sessionExists = listSessionData.some(
            (session) => session.sessionId === sessionId,
          );
          if (!sessionExists) {
            setListSessionData((prevData) => [...prevData, response]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [listSessionData],
  );

  // useEffect(() => {
  //   if (preparationProgress?.SessionId) {
  //     fetchSessionById(preparationProgress?.SessionId);
  //   }
  // }, [preparationProgress?.SessionId, fetchSessionById]);

  useEffect(() => {
    if (preparationProgress?.SessionId) {
      const sessionExists = listSessionData.some(
        (session) => session.sessionId === preparationProgress.SessionId,
      );
      if (sessionExists) {
        setListSessionData((prevData) =>
          prevData.map((session) =>
            session.sessionId === preparationProgress.SessionId
              ? {
                  ...session,
                  prepareAttendance: {
                    ...session.prepareAttendance,
                    progress: preparationProgress.Progress,
                  },
                }
              : session,
          )
          .filter((session) =>
            session.sessionId === preparationProgress.SessionId
              ? session.prepareAttendance.progress < 100
              : true
          )
        );
      } else {
        fetchSessionById(preparationProgress.SessionId);
      }
    }
  }, [preparationProgress?.SessionId, preparationProgress?.Progress]);

  const convertTimestamp = (timestamp: any) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <Button
        className="circular-button"
        type="link"
        shape="circle"
        onClick={showModal}
        style={{marginTop:30}}
      >
        {/* <Progress
          type="circle"
          percent={preparationProgress?.Progress}
          size={40}
          format={() => (
            <>
              <div>
                <b>P</b>
              </div>
            </>
          )}
        /> */}
        <div>
          <div className={`spinner ${(preparationProgress?.Progress !== 100 && preparationProgress !== null) ? 'spin' : (preparationProgress?.Progress === 100 || preparationProgress === null) ? 'static' : 'static'}`} />
        </div>
      </Button>
      <Modal
        title="Progress Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        {/* {listSessionData.map(session => (
          // <div>
          //   <Typography.Text strong>{session.title}</Typography.Text>
          //   <br />
          //   <Typography.Text>{session.moduleId}</Typography.Text>
          //   <br />
          //   <Typography.Text>{session.timeStamp}</Typography.Text>
          //   <br />
          //   <Typography.Text>{`Progress: ${session.prepareAttendance.progress}%`}</Typography.Text>
          // </div>
          <Card style={{width:'100%'}}>
            <Typography.Text strong>{session.title}</Typography.Text>
            <Typography.Text>{session.moduleId}</Typography.Text>
            <Typography.Text>{session.timeStamp}</Typography.Text>
            <Progress percent={session.prepareAttendance.progress} showInfo={false} />
          </Card>
        ))} */}
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={listSessionData}
          style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
          renderItem={(item) => (
            <List.Item>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <List.Item.Meta
                    title={item.title}
                    description={convertTimestamp(item.timeStamp)}
                  />
                  <Progress
                    percent={item.prepareAttendance.progress}
                    showInfo={false}
                    style={{ marginTop: '8px' }}
                  />
                </div>
                <b style={{ minWidth: '100px', textAlign: 'right' }}>
                  Module {item.moduleId}
                </b>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default HeaderProgress;
