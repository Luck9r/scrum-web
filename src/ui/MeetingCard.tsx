import React from 'react';
import {MeetingData} from "@/interfaces/MeetingData";
import LInk from "next/link";
import axios from "@/lib/axios";
import {BsCameraVideoFill, BsClockHistory, BsFillXCircleFill} from "react-icons/bs";

interface MeetingCardProps {
    meeting: MeetingData;
    showEditButton?: boolean;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, showEditButton }) => {
    const { name, datetime, meetingLink, id } = meeting;

    const formatDateTime = (datetime: string): string => {
        const date = new Date(datetime);
        const formattedDate = date.toLocaleDateString('en-CA');
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${formattedDate} at ${formattedTime}`;
    };

    const willBeLate = async (meetingId: number) => {
        try {
            await axios.post(`/api/meeting/${meetingId}/late`, {"datetime": datetime});
            alert('You have notified the team that you will be late.');
        } catch (error) {
            console.error('Failed to notify the team.', error);
            alert('Failed to notify the team.');
        }
    };

    const willNotAttend = async (meetingId: number) => {
        try {
            await axios.post(`/api/meeting/${meetingId}/absent`, {"datetime": datetime});
            alert('You have notified the team that you will not attend.');
        } catch (error) {
            console.error('Failed to notify the team.', error);
            alert('Failed to notify the team.');
        }
    };

    return (
        <div className="card card-compact bg-secondary text-base-content w-72 shadow-xl my-3">
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p>{formatDateTime(datetime)}</p>
                <div className="card-actions justify-end">
                    <div className="flex flex-col space-y-2">
                        <div className="flex flex-row justify-end space-x-2">
                            <button className="btn btn-sm btn-error " onClick={() =>willBeLate(id)}><BsClockHistory/>Late</button>
                            <button className="btn btn-sm btn-error bg-red-500 border-red-500" onClick={() =>willNotAttend(id)}><BsFillXCircleFill/>Won&#39;t attend</button>
                        </div>
                        <div className="flex flex-row justify-end space-x-2">
                            {showEditButton && (
                                <LInk href={`/meeting/${id}`} className="btn btn-secondary">Edit</LInk>
                            )}
                            <a href={meetingLink} className="btn btn-primary " target="_blank"
                               rel="noopener noreferrer">
                                <BsCameraVideoFill/>Join Meeting
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default MeetingCard;
