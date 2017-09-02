import DSB from './index';
import jsome from 'jsome';

const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

dsb.fetch(console.log).then(data => {
	jsome(DSB.findMethodInData('timetable', data) || {});
	jsome(DSB.findMethodInData('tiles', data) || {});
	jsome(DSB.findMethodInData('news', data) || {});
}).catch(console.error);