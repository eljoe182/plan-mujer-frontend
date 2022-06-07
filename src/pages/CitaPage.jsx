import Kalend, { CalendarView } from 'kalend' // import component
import 'kalend/dist/styles/index.css'; // import styles
import { getAll } from '../services/citas.api';
import { useEffect, useState } from 'react';

const CitaPage=()=>{
    const [eventos, setEventos]=useState([])
    const getdata=async ()=>{
        await getAll().then((response)=>{
            console.log(response)
            const newdata=response.rows.map((cita)=>{
               return {
                id: cita.id,
                startAt: cita.fechaHoraInicio,
                endAt: cita.fechaHoraFin,
                timezoneStartAt: 'America/Santiago', // optional
                summary: cita.description?? '',
                color: 'blue',
                calendarID: 'work'
            }
            })
            setEventos(newdata)
        })
    }
    useEffect(()=>{
        getdata()
    },[])
    return (<Kalend
        //onEventClick={onEventClick}
        //onNewEventClick={onNewEventClick}
        events={eventos}
        initialDate={new Date().toISOString()}
        hourHeight={60}
        initialView={CalendarView.WEEK}
        disabledViews={[CalendarView.DAY]}
        //onSelectView={onSelectView}
        //selectedView={selectedView}
        //onPageChange={onPageChange}
        timeFormat={'24'}
        weekDayStart={'Monday'}
        calendarIDsHidden={['work']}
        language={'en'}
      />)
}
export default CitaPage