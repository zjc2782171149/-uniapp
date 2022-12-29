import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const isExceedTime = (time) =>{
	const nowTime = dayjs();
	return nowTime.diff(time, 'second');
}