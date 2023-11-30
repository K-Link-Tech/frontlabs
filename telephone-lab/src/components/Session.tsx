import { DataTransferBoth, PhonePaused, PhoneXmark } from "iconoir-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "./Base/Card";
import { Title } from "./Base/Title";
import { DialPad } from "./Telephone";

type SessionType = {
	session: any;
	phone: any;
};

export default function Session(props: SessionType) {
	const { session, phone } = props;
	const [callInfo, setCallInfo] = useState(session.status);
	const [callStatus, setCallStatus] = useState(session.status.callStatus);
	const [timer, setTimer] = useState(session.timer);
	const [remoteStream, setRemoteStream] = useState(null);
	const [number, setNumber] = useState<string | null>(null);
	const [isTransfer, setIsTransfer] = useState(false);
	const [transferType, setTransferType] = useState<string | null>(null);
	const remoteAudioRef = useRef(null);
	const hangupHandler = () => {
		session.terminate("hangup");
	};
	const onHoldHandler = () => {
		session.hold();
	};
	const unHoldHandler = () => {
		session.unhold();
	};
	const attendedHandler = (number: string) => {
		setNumber(number);
		phone.call(number, undefined, callInfo.callId);
	};
	const transferHandler = () => {
		const currentSession = phone.getCurrentSession();
		currentSession.attendedTransfer(number);
	};
	const blindHandler = (number: string) => {
		session.blindTransfer(number);
	};

	const onTransfer = (type: string) => {
		setIsTransfer(!isTransfer);
		setTransferType(type);
	};

	// confirmed
	useEffect(() => {
		const handler = ({ callId, session }: { callId: any; session: any }) => {
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
		const handler = ({ callId, session }: { callId: any; session: any }) => {
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
		const handler = ({ callId, cause }: { callId: any; cause: any }) => {
			console.log(`callId: ${callId} has been failed. cause:${cause}`);
		};
		session.on("failed", handler);
		return () => {
			session.removeListener("failed", handler);
		};
	}, [session]);

	// ended
	useEffect(() => {
		const handler = ({ callId, cause }: { callId: any; cause: any }) => {
			console.log(`callId: ${callId} has been ended.`);
		};
		session.on("ended", handler);
		return () => {
			session.removeListener("ended", handler);
		};
	}, [session]);

	// timer update.
	useEffect(() => {
		const handler = ({ callId, timer: newTimer }) => {
			setTimer({ ...newTimer });
		};
		session.on("updateTimer", handler);
		return () => {
			session.removeListener("updateTimer", handler);
		};
	}, [session]);

	// status changed.
	useEffect(() => {
		const handler = (newStatus, oldStatus) => {
			console.log(`callId: ${newStatus.callId} status change.`);
			setCallInfo(newStatus);
		};
		session.on("statusChange", handler);
		return () => {
			session.removeListener("statusChange", handler);
		};
	}, [session]);

	// handle remote stream
	useEffect(() => {
		const handler = ({ remoteStream }: { remoteStream: any }) => {
			if (!remoteStream?.getTracks?.()) return;
			setRemoteStream(remoteStream);
		};
		session.on("updateRemoteStream", handler);
		return () => {
			session.removeListener("updateRemoteStream", handler);
		};
	}, [session]);

	// set audio stream
	useEffect(() => {
		if (!remoteStream) return;
		// const audioTracks = remoteStream.getAudioTracks();
		// if (audioTracks) remoteAudioRef.current?.srcObject = remoteStream;
	}, [remoteStream]);

	return (
		<Card className="text-dark list-none p-4">
			<Title size="md">Call in Progress</Title>
			<div>
				{callInfo.avatar ? (
					<img src={callInfo.avatar} width={60} height={60} alt="avatar" />
				) : (
					"none avatar"
				)}
			</div>

			<div>
				Call id: <span className="font-bold">{callInfo.callId}</span>
			</div>
			<div>Name: {callInfo.name}</div>
			<div>Number: {callInfo.number}</div>
			<div>Call status: {callStatus}</div>
			<div>
				Duration
				{callStatus === "ringing" && " ringing:" + timer.ringDuration}
				{(callStatus === "calling" || callStatus === "connecting") &&
					" calling:" + timer.callingDuration}
				{callStatus === "talking" && " talking:" + timer.callDuration}
				{callInfo.isHold && " hold:" + timer.holdDuration}
			</div>
			<audio ref={remoteAudioRef} autoPlay />
			{isTransfer && callStatus === "talking" && (
				<div className="my-4">
					<DialPad
						onCall={(number) =>
							transferType === "attended"
								? attendedHandler(number)
								: blindHandler(number)
						}
					/>
				</div>
			)}
			<div className="mt-4 flex space-x-4">
				{callStatus === "talking" && (
					<>
						{callInfo.isHold ? (
							<button
								className="flex items-center rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-800"
								onClick={unHoldHandler}
							>
								Resume <PhonePaused />
							</button>
						) : (
							<button
								className="flex items-center rounded-md bg-slate-800 p-2 text-white hover:bg-slate-800"
								onClick={onHoldHandler}
							>
								Hold <PhonePaused />
							</button>
						)}
						<button
							className="flex items-center rounded-md bg-lime-500 p-2 text-white hover:bg-lime-600"
							onClick={() => onTransfer("attended")}
						>
							Attended <DataTransferBoth />
						</button>

						<button
							className="flex items-center rounded-md bg-orange-300 p-2 text-white hover:bg-orange-600"
							onClick={() => onTransfer("blind")}
						>
							Blind <DataTransferBoth />
						</button>
						<button
							className="flex items-center rounded-md bg-lime-500 p-2 text-white hover:bg-lime-600"
							onClick={transferHandler}
						>
							Transfer <DataTransferBoth />
						</button>
					</>
				)}

				<button
					className="flex items-center rounded-md bg-red-600 p-2 text-white hover:bg-red-800"
					onClick={hangupHandler}
				>
					<span>{callStatus === "talking" ? "Hangup" : "Cancel"}</span>{" "}
					<PhoneXmark />
				</button>
			</div>
		</Card>
	);
}
