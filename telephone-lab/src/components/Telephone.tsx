import { cn } from "@/utils";
import { useCallSessionStore } from "@/utils/zustand";
import {
	DataTransferBoth,
	Dialpad,
	Microphone,
	MicrophoneMute,
	Phone,
	PhoneOutcome,
	PhonePaused,
	PhoneXmark,
	Shuffle,
} from "iconoir-react";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import type { CallStatus, Session } from "ys-webrtc-sdk-core";
import { Button } from "./Base/Button";
import { Card } from "./Base/Card";
import { Input } from "./Base/Input";
import { Title } from "./Base/Title";

// ////////////////////////////////////////
// DialPad
// ////////////////////////////////////////
interface DialPadProps {
	disabled?: boolean;
	onCall?: (phoneNumber: string) => void;
}
export function DialPad({ disabled = false, onCall }: DialPadProps) {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [formError, setFormError] = useState<{
		phoneNumber: string;
		errors: string[];
	}>({ phoneNumber: "", errors: [] });

	function validatePhoneNumber(phoneNumber: string) {
		if (phoneNumber.length <= 0) {
			setFormError((e) => ({
				...e,
				phoneNumber: "Please enter phone number.",
			}));
			return;
		}

		const phoneNumberSchema = new RegExp("[A-z]+", "g");
		if (phoneNumberSchema.test(phoneNumber)) {
			setFormError((e) => ({
				...e,
				phoneNumber: "Invalid phone number.",
			}));
			return;
		}

		setFormError((e) => ({ ...e, phoneNumber: "" }));
	}

	return (
		<Card className="flex flex-col gap-4">
			<Title size="md">Call Outgoing</Title>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (onCall) onCall(phoneNumber || "");
				}}
			>
				<fieldset disabled={disabled}>
					<Input
						type="tel"
						label="Enter Phone Number"
						name="phoneNumber"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.currentTarget.value)}
						error={formError.phoneNumber}
						onInput={(e) => validatePhoneNumber(e.currentTarget.value)}
						onBlur={(e) => validatePhoneNumber(e.currentTarget.value)}
						rightSlot={
							<Button title="Start Call" type="submit" className="ml-4">
								<PhoneOutcome />
							</Button>
						}
					/>
				</fieldset>
			</form>
		</Card>
	);
}

// ////////////////////////////////////////
// InProgress Call
// ////////////////////////////////////////
interface CallInProgressProps {
	title?: ReactNode;
	hidden?: boolean;
	callInfo?: ReactNode;
	disabledControls?: boolean;
	session?: Session;
	onMute?: () => void;
	onHold?: () => void;
	onHangup?: () => void;
	onBlindTransfer?: () => void;
	onAttendantTransfer?: () => void;
	onDTMF?: () => void;
}
type InputStatus = "" | "BlindTransfer" | "AttendantTransfer" | "DTMF";
type EventType = {
	callId?: string;
	session: Session;
	cause?: string;
	timer?: any;
};
export function CallInProgress({
	title,
	hidden = false,
	disabledControls = false,
	onMute,
	onHold,
	onHangup,
	onBlindTransfer,
	onAttendantTransfer,
	onDTMF,
}: CallInProgressProps) {
	const {
		phone,
		sessions: allSessions,
		callTransfer,
		setCallTransfer,
	} = useCallSessionStore();
	const [session, newSession] = allSessions;
	const [inputStatus, setInputStatus] = useState<InputStatus>("");
	const [number, setNumber] = useState("");
	const [callInfo, setCallInfo] = useState(session.status);
	const [callStatus, setCallStatus] = useState(session.status.callStatus);
	const [transferCallStatus, setTransferCallStatus] = useState<
		CallStatus | string
	>("");
	// const [timer, setTimer] = useState(session.timer);

	const toggleInputStatus = useCallback(
		(status: InputStatus) => {
			if (inputStatus !== status) setInputStatus(status);
			else setInputStatus("");
		},
		[inputStatus],
	);

	const inputFormSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			switch (inputStatus) {
				case "AttendantTransfer":
					setCallTransfer(true);
					phone?.call(number, undefined, callInfo.callId);
					return;
				case "BlindTransfer":
					session.blindTransfer(number);
					return;
				case "DTMF":
					onDTMF && onDTMF();
					return;
				default:
					return;
			}
		},
		[
			inputStatus,
			setCallTransfer,
			phone,
			number,
			callInfo.callId,
			session,
			onDTMF,
		],
	);

	// confirmed
	useEffect(() => {
		const handler = ({ callId, session }: EventType) => {
			console.log(`callId: ${callId} has been confirmed.`);
			setCallStatus(session.status.callStatus);
		};
		session.on("confirmed", handler);
		return () => {
			session.removeListener("confirmed", handler);
		};
	}, [session]);

	// accepted
	useEffect(() => {
		const handler = ({ callId, session }: EventType) => {
			console.log(`callId: ${callId} has been accepted.`);
			setCallStatus(session.status.callStatus);
		};
		session.on("accepted", handler);
		return () => {
			session.removeListener("accepted", handler);
		};
	}, [session]);

	// failed
	useEffect(() => {
		const handler = ({ callId, cause }: EventType) => {
			console.log(`callId: ${callId} has been failed. cause:${cause}`);
		};
		session.on("failed", handler);
		return () => {
			session.removeListener("failed", handler);
		};
	}, [session]);

	// ended
	useEffect(() => {
		const handler = ({ callId, cause }: EventType) => {
			console.log(`callId: ${callId} has been ended.`);
		};
		session.on("ended", handler);
		return () => {
			session.removeListener("ended", handler);
		};
	}, [session]);

	// timer update.
	// useEffect(() => {
	// 	const handler = ({ callId, timer: newTimer }: EventType) => {
	// 		setTimer({ ...newTimer });
	// 	};
	// 	session.on("updateTimer", handler);
	// 	return () => {
	// 		session.removeListener("updateTimer", handler);
	// 	};
	// }, [session]);

	// status changed.
	useEffect(() => {
		const handler = (newStatus: CallStatus, oldStatus: CallStatus) => {
			console.log(`callId: ${newStatus.callId} status change.`);
			setCallInfo(newStatus);
		};
		session.on("statusChange", handler);
		return () => {
			session.removeListener("statusChange", handler);
		};
	}, [session]);

	useEffect(() => {
		if (!newSession) return;
		const handler = (newStatus: CallStatus, oldStatus: CallStatus) => {
			console.log(`callId: ${newStatus.callId} status change.`);
			setTransferCallStatus(newStatus);
		};
		newSession.on("statusChange", handler);
		return () => {
			newSession.removeListener("statusChange", handler);
		};
	}, [newSession]);

	// show calling ui
	if (callStatus === "calling") {
		return (
			<Card className={cn("flex flex-col gap-4", hidden ? "hidden" : "")}>
				<Title size="md">{callInfo.number}</Title>
				<p>Calling .... </p>
				<Button
					title="Hangup"
					onClick={() => session.hangup()}
					className="bg-red-700 hover:bg-red-800"
				>
					Cancel <PhoneXmark />
				</Button>
			</Card>
		);
	}

	// transfer new session
	if (newSession) {
		console.log("newSession", newSession);
		return (
			<Card className={cn("flex flex-col gap-4", hidden ? "hidden" : "")}>
				<Title size="md" className="text-orange-400">
					{callInfo.number} is holding
				</Title>
				<article className="font-mono text-sm">
					<p>Name: {newSession.status.name}</p>
					<p className="text-green-400">Number: {newSession.status.number}</p>
					<p>Call status: {newSession.status.callStatus}</p>
					{/* <p>
				Duration:{" "}
				{callStatus === "ringing" && " ringing:" + timer.ringDuration}
				{callStatus === "connecting" && " calling:" + timer.callingDuration}
				{callStatus === "talking" && " talking:" + timer.callDuration}
				{callInfo.isHold && " hold:" + timer.holdDuration}
			</p> */}
				</article>
				<CallControl
					number={number}
					session={newSession}
					callInfo={newSession.status}
					onToggle={(value) => toggleInputStatus(value)}
				/>

				{inputStatus.length > 0 && (
					<form className="flex items-end gap-4" onSubmit={inputFormSubmit}>
						<Input
							label={inputStatus}
							value={number}
							onChange={(e) => setNumber(e.currentTarget.value)}
						/>
						<Button type="submit">
							<PhoneOutcome />
						</Button>
					</form>
				)}
			</Card>
		);
	}

	return (
		<Card className={cn("flex flex-col gap-4", hidden ? "hidden" : "")}>
			<Title size="md">{callInfo.number}</Title>
			<article className="font-mono text-sm">
				<p>Name: {callInfo.name}</p>
				<p>Number: {callInfo.number}</p>
				<p>Call status: {callStatus}</p>
				{/* <p>
					Duration:{" "}
					{callStatus === "ringing" && " ringing:" + timer.ringDuration}
					{callStatus === "connecting" && " calling:" + timer.callingDuration}
					{callStatus === "talking" && " talking:" + timer.callDuration}
					{callInfo.isHold && " hold:" + timer.holdDuration}
				</p> */}
			</article>

			<CallControl
				number={number}
				session={session}
				callInfo={callInfo}
				onToggle={(value) => toggleInputStatus(value)}
			/>

			{inputStatus.length > 0 && (
				<form className="flex items-end gap-4" onSubmit={inputFormSubmit}>
					<Input
						label={inputStatus}
						value={number}
						onChange={(e) => setNumber(e.currentTarget.value)}
					/>
					<Button type="submit">
						<PhoneOutcome />
					</Button>
				</form>
			)}
		</Card>
	);
}

export function CallControl({
	session,
	callInfo,
	onToggle,
	number,
}: {
	session: Session;
	callInfo: CallStatus;
	onToggle: (value: InputStatus) => void;
	number: string;
}) {
	return (
		<>
			<fieldset className="flex flex-wrap gap-4">
				{callInfo.isMute ? (
					<Button
						title="Unmute Mic"
						onClick={() => session.unmute()}
						className="bg-indigo-700 hover:bg-indigo-800"
					>
						Unmute <Microphone />
					</Button>
				) : (
					<Button
						title="Mute Mic"
						onClick={() => session.mute()}
						className="bg-indigo-300 hover:bg-indigo-400"
					>
						Mute <MicrophoneMute />
					</Button>
				)}

				{callInfo.isHold ? (
					<Button
						title="Unhold Call"
						onClick={() => session.unhold()}
						className="bg-slate-700 hover:bg-slate-800"
					>
						Un-hold <Phone />
					</Button>
				) : (
					<Button
						title="Hold Call"
						onClick={() => session.hold()}
						className="bg-slate-300 hover:bg-slate-400"
					>
						Hold <PhonePaused />
					</Button>
				)}

				{!session.status.isTransfer && (
					<>
						<Button
							title="Blind Transfer"
							onClick={() => onToggle("BlindTransfer")}
							className="bg-yellow-500 hover:bg-yellow-600"
						>
							Blind Transfer <DataTransferBoth />
						</Button>

						<Button
							title="Attendant Transfer"
							onClick={() => onToggle("AttendantTransfer")}
							className="bg-emerald-500 hover:bg-emerald-600"
						>
							Attendant Transfer <Shuffle />
						</Button>

						<Button
							title="DTMF"
							onClick={() => onToggle("DTMF")}
							className="bg-rose-500 hover:bg-rose-600"
						>
							DTMF <Dialpad />
						</Button>
					</>
				)}

				<Button
					title="Hangup"
					onClick={() => session.hangup()}
					className="bg-red-700 hover:bg-red-800"
				>
					{session.status.isTransfer ? "Cancel" : "Hangup"} <PhoneXmark />
				</Button>
				{session.status.isTransfer && (
					<Button
						title="Attendant Transfer"
						onClick={() => session.attendedTransfer(number)}
						className="bg-emerald-500 hover:bg-emerald-600"
					>
						Transfer <Shuffle />
					</Button>
				)}
			</fieldset>
		</>
	);
}

// ////////////////////////////////////////
// Incoming Call
// ////////////////////////////////////////
interface IncomingCallProps {
	callInfo?: ReactNode;
	session: Session;
	onReject?: () => void;
	onAccept?: () => void;
	handler: () => void;
}
export function IncomingCall({
	callInfo,
	session,
	onReject,
	onAccept,
	handler,
}: IncomingCallProps) {
	const handleReject = () => {
		session?.reject();
		handler();
	};

	const handleAccept = () => {
		session?.answer();
		handler();
	};

	return (
		<Card>
			<audio src="sound/ringtone.mp3" autoPlay />

			<div className="flex items-start justify-between">
				<Title size="md" className="mb-4">
					{session.status.number}
				</Title>

				<article className="flex justify-end gap-4">
					<Button
						title="Reject Call"
						onClick={handleReject}
						className="bg-red-700 hover:bg-red-800"
					>
						<PhoneXmark />
					</Button>

					<Button
						title="Accept Call"
						onClick={handleAccept}
						className="bg-emerald-700 hover:bg-emerald-800"
					>
						<Phone />
					</Button>
				</article>
			</div>

			<article className="font-mono text-sm">{callInfo}</article>
		</Card>
	);
}
