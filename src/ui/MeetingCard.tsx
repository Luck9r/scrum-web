import React from 'react';
import {MeetingData} from "@/interfaces/MeetingData";
import LInk from "next/link";
import {BsCameraVideoFill} from "react-icons/bs";

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

    return (
        <div className="card card-compact bg-secondary text-base-content w-72 shadow-xl my-3">
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p>{formatDateTime(datetime)}</p>
                <div className="card-actions justify-end">
                    {showEditButton && (
                        <LInk href={`/meeting/${id}`} className="btn btn-secondary">Edit</LInk>
                    )}
                    <a href={meetingLink} className="btn btn-primary " target="_blank" rel="noopener noreferrer">
                        <BsCameraVideoFill/>Join Meeting
                    </a>
                </div>

            </div>
        </div>
    );
};

export default MeetingCard;
