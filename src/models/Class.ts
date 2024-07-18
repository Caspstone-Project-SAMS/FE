export interface DataType {
  key: React.Key;
  day: string;
  subject: string;
  room: string;
  slot: number;
  classcode: string;
  specialized: string;
  groupsize: number;
}

export interface ClassMessage {
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
