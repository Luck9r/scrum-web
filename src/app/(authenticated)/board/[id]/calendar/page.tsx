'use client';
import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MeetingData } from '@/interfaces/MeetingData';
import MeetingCard from "@/ui/MeetingCard";
import {useAuth} from "@/hooks/auth";
import Link from "next/link";
import {useParams} from "next/navigation";
import MeetingForm from '@/ui/MeetingForm';

const CalendarPage: React.FC = () => {
    const [meetings, setMeetings] = useState<MeetingData[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date(new Date().setDate(new Date().getDate() - 3)),
        new Date(new Date().setDate(new Date().getDate() + 3)),
    ]);
    const [startDate, endDate] = dateRange;

    const params = useParams();
    const boardId = Number(params.id);

    useEffect(() => {
        const fetchMeetings = async () => {
            if (startDate && endDate) {
                try {
                    const response = await axios.get(`/api/board/2/meetings/date-range/from/${startDate.toISOString().split('T')[0]}/to/${endDate.toISOString().split('T')[0]}`);
                    const mappedMeetings: MeetingData[] = response.data.map((meeting: any) => ({
                        id: meeting.id,
                        name: meeting.name,
                        boardId: meeting.board_id,
                        datetime: meeting.datetime,
                        meetingLink: meeting.meeting_link,
                        repeat: meeting.repeat,
                    }));
                    setMeetings(mappedMeetings);
                } catch (error) {
                    console.error('Failed to fetch meetings:', error);
                }
            }
        };

        void fetchMeetings();
    }, [startDate, endDate]);

    const groupMeetingsByDay = (meetings: MeetingData[]) => {
        return meetings.reduce((groupedMeetings, meeting) => {
            const date = new Date(meeting.datetime).toISOString().split('T')[0];
            if (!groupedMeetings[date]) {
                groupedMeetings[date] = [];
            }
            groupedMeetings[date].push(meeting);
            return groupedMeetings;
        }, {} as Record<string, MeetingData[]>);
    };

    const groupedMeetings = groupMeetingsByDay(meetings);
    const { user } = useAuth({ middleware: 'auth' });
    const allowedRoles = ['admin', 'product_owner', 'scrum_master'];
    const canEdit = user && user.roles.some((role: { name: string }) => allowedRoles.includes(role.name));

    return (
        <div className="flex flex-row">
        <div className="flex flex-col items-center w-96">
            <Link href={`/board/${boardId}`} className="btn btn-primary mb-4 mt-10 ml-10">
                Go to Board
            </Link>
            <div className="p-4 card bg-base-300 max-w-96 mt-10 ml-10">
                <div className="card-body">
                    <h1 className="text-3xl font-semibold mb-4 card-title">Meetings</h1>
                    <div className="flex justify-center mb-4">
                        <DatePicker
                            selected={startDate}
                            onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            dateFormat={'yyyy-MM-dd'}
                            className="input input-bordered w-60 text-center"
                        />
                    </div>
                    <div className="max-h-96 overflow-scroll min-w-max">
                        {Object.entries(groupedMeetings).map(([date, meetings]) => (
                            <div key={date} className="mb-4">
                                <h2 className="text-xl font-semibold">{(new Date(date)).toLocaleDateString([], {
                                    weekday: 'short',
                                    month: 'long',
                                    day: 'numeric',
                                })}</h2>
                                <ul>
                                    {meetings.map(meeting => (
                                        <MeetingCard meeting={meeting} key={meeting.id+meeting.datetime} showEditButton={canEdit} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
            {canEdit &&
                <MeetingForm
                    boardId={boardId}
                    onSave={(newMeeting: MeetingData) => {
                        setMeetings([...meetings, newMeeting]);
                    }}
                />}
        </div>
    );
};

export default CalendarPage;
