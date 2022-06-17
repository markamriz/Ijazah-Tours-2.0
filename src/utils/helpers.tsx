import { User } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import { v4 as uuid } from 'uuid';

import { db } from '../firebase';
import { Order } from './types';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: any, b: any) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const widthHeightDynamicStyle = (
  value: number,
  threshold: number,
  ifTrue: string | number | undefined,
  ifFalse: string | number | undefined,
) => (value < threshold ? ifTrue : ifFalse);

export const uploadImage = async (
  storage: FirebaseStorage,
  container: string,
  pic: string,
  filepath: string,
) => {
  const randomString = uuid();
  const storageRef = ref(storage, `${container}/${randomString + filepath}`);
  await uploadString(storageRef, pic, 'data_url');
  return getDownloadURL(storageRef);
};

export const uploadPDF = async (
  storage: FirebaseStorage,
  container: string,
  pdf: Blob,
  filepath: string,
) => {
  const storageRef = ref(storage, `${container}/${filepath}`);
  await uploadBytes(storageRef, pdf, {
    contentType: 'application/pdf',
  });

  return getDownloadURL(storageRef);
};

export const getUserOnLogin = async (user: User) => {
  const userData = (await getDocs(collection(db, 'Team Members')))
    .docs.find((doc) => doc.get('email') === user.email);
  const data = userData!.data();
  const { id } = userData!;
  data.id = id;
  return data;
};

export const searchData = (search: string, initialData: any, setter: any) => {
  if (search) {
    const filteredData: any[] = [];

    initialData?.forEach((each: any) => {
      if ((each?.name?.toLowerCase().includes(search.toLowerCase()))) {
        filteredData.push(each);
      }
    });

    setter(filteredData);
  } else {
    setter(initialData);
  }
};

export const getDaysDifference = (a: string, b: string) => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  const difference = dateA.getTime() - dateB.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
};

export const getElementWidth = (id: string) => {
  const element = document.querySelector<HTMLElement>(`#${id}`);
  const elementWidth = element!.offsetWidth;
  const elementHeight = element!.offsetHeight;
  return { elementWidth, elementHeight };
};

const num = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
const tens = 'twenty thirty forty fifty sixty seventy eighty ninety'.split(' ');

export const number2words: any = (n: any) => {
  if (n < 20) {
    return num[n];
  }

  const digit = n % 10;
  if (n < 100) {
    return tens[~~(n / 10) - 2] + (digit ? ` ${num[digit]}` : '');
  }

  if (n < 1000) {
    return `${num[~~(n / 100)]} hundred${n % 100 === 0 ? '' : ` and ${number2words(n % 100)}`}`;
  }

  return `${number2words(~~(n / 1000))} thousand${n % 1000 !== 0 ? ` ${number2words(n % 1000)}` : ''}`;
};

export const convertDateToFullMonth = (date: string) => {
  const dt = new Date(date);
  return `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
};

export const statusOptions = [
  { label: 'ACTIVE', value: 'ACTIVE' },
  { label: 'INACTIVE', value: 'INACTIVE' },
];

export const vehicleOptions = [
  { label: 'Nissan', value: 'Nissan' },
  { label: 'Suzuki', value: 'Suzuki' },
  { label: 'BMW', value: 'BMW' },
];

export const mealPlanOptions = [
  { label: 'BB', value: 'BB' },
  { label: 'FB', value: 'FB' },
  { label: 'HB', value: 'HB' },
];

export const tourTypeOptions = [
  { label: 'Standard Tour', value: 'Standard Tour' },
  { label: 'Only Driver Tour', value: 'Only Driver Tour' },
];

export const dateTypeOptions = [
  { label: 'Specific Dates', value: 'Specific Dates' },
  { label: 'Not Specific', value: 'Not Specific' },
];

export const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Travel Agent', value: 'Travel Agent' },
];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Hotel costing Api's
export const AGGREGATOR_BASE_URL = 'https://hotel-price-aggregator.p.rapidapi.com/';
export const AGGREGATOR_HOST = 'hotel-price-aggregator.p.rapidapi.com';
export const HOTELS_API_BASE_URL = 'https://hotels4.p.rapidapi.com/';
export const HOTELS_API_HOST = 'hotels4.p.rapidapi.com';
export const RAPID_API_KEY = '7effb9d8d0msh066f74e0e5b56cep164c86jsn72c35d18cd01';

// Google calendar related
export const GOOGLE_CALENDAR_CLIENT_ID = '870677425628-honf8u48outj7as3a0lero6hfvsjsmo8.apps.googleusercontent.com';
export const GOOGLE_CALENDAR_API_KEY = 'AIzaSyDTxBWYdtijZG_VVMPH1gsd_kmS5TF4Sn0';
export const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
export const SCOPES = 'https://www.googleapis.com/auth/calendar';

export const handleClientLoad = () => {
  (window as any).gapi.load('client:auth2', initCalendarClient);
};

const initCalendarClient = () => {
  (window as any).gapi.client.init({
    apiKey: GOOGLE_CALENDAR_API_KEY,
    clientId: GOOGLE_CALENDAR_CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  }).then(() => {
    (window as any).gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus((window as any).gapi.auth2.getAuthInstance().isSignedIn.get());
  });
};

const updateSigninStatus = (isSignedIn: boolean) => {
  if (!isSignedIn) {
    (window as any).gapi.auth2.getAuthInstance().signIn();
  }
};
