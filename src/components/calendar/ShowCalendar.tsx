import React from 'react';
import { Content } from "antd/es/layout/layout";
import { Badge, Calendar } from 'antd';
import './HomeCalendar.css';
import { Dayjs } from 'dayjs';

interface EventItem {
    type: 'warning' | 'success' | 'error' | 'processing' | 'default';
    content: string;
  }

  const getListData = (value: Dayjs): EventItem[] => {
    let listData: EventItem[] = [];
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ];
        break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event......' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ];
      break;
    default:
      listData = [];
  }
  return listData;
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const ShowCalendar: React.FC = () => {
    const monthCellRender = (value: Dayjs) => {
      const num = getMonthData(value);
      return num ? (
        <div className="notes-month">
          <section>{num}</section>
          <span>Backlog number</span>
        </div>
      ) : null;
    };
  
    const dateCellRender = (value: Dayjs) => {
      const listData = getListData(value);
      return (
        <ul className="events">
          {listData.map((item) => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      );
    };
  
    return (
      <Content className='calendar-content'>
        <div className="calendar-container">
          <Calendar className='calendar' dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
        </div>
      </Content>
    );
  };
  
  export default ShowCalendar;