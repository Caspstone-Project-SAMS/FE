export interface Room {
  roomID?: number;
  roomName?: string;
  roomDescription?: string;
  roomStatus?: number;
}

export interface RoomMessage {
  data: {
    data: {
      data: {
        isSuccess?: boolean;
        title?: string;
        errors?: string[];
        result?: null;
      };
      status: boolean;
    };
  };
}

interface RoomDetail {
  roomID?: number;
  roomName?: string;
  roomDescription?: string;
  roomStatus?: boolean;
}
