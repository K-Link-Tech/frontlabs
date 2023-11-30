import { echo } from "@/utils";
import { initLinkus } from "@/utils/linkus-sdk";
import { GetYeastarSignature } from "@/utils/yeastar-handshake";
import { Copy, Play, Refresh, Square } from "iconoir-react";
import { useCallback, useEffect, useState } from "react";
import type { PBXOperator, PhoneOperator, Session } from "ys-webrtc-sdk-core";
import { Button } from "./Base/Button";
import { Card } from "./Base/Card";
import { Input } from "./Base/Input";
import { Title } from "./Base/Title";
import { CallInProgress, DialPad, IncomingCall } from "./Telephone";

export function SignatureForm() {
	const [username, setUsername] = useState("1000");
	const [AccessID, setAccessId] = useState("");
	const [AccessKey, setAccessKey] = useState("");
	const [apiUrl, setApiUrl] = useState("");

	const [isGettingSignature, setIsGettingSignature] = useState(false);
	const [signature, setSignature] = useState("");
	const [signatureError, setSignatureError] = useState("");

	const getSignature = useCallback(() => {
		setIsGettingSignature(true);
		const signature = new GetYeastarSignature({
			AccessID,
			AccessKey,
			apiUrl,
			username,
		});
		signature
			.handshake()
			.then(({ data, errcode, errmsg }) => {
				if (errmsg === "FAILURE") {
					setSignatureError(errcode + ": Failed to load signature.");
				} else {
					setSignature(data.sign);
					setSignatureError("");
				}
			})
			.catch((err) => {
				setSignatureError("Throw on handshake.");
				throw new Error(err);
			})
			.finally(() => setIsGettingSignature(false));
	}, [AccessID, AccessKey, apiUrl, username]);

	const copySignatureToClipboard = useCallback(() => {
		if (signature.length > 0) navigator.clipboard.writeText(signature);
	}, [signature]);

	return (
		<section className="mb-8 grid grid-cols-2 gap-8 border-b-2 border-slate-400 pb-8">
			<div className="flex flex-col items-stretch gap-4">
				<Input
					label="Username"
					value={username}
					onChange={(e) => setUsername(e.currentTarget.value)}
				/>
				<Input
					label="AccessID"
					value={AccessID}
					onChange={(e) => setAccessId(e.currentTarget.value)}
				/>
				<Input
					label="AccessKey"
					value={AccessKey}
					onChange={(e) => setAccessKey(e.currentTarget.value)}
				/>
				<Input
					label="Api Url"
					value={apiUrl}
					onChange={(e) => setApiUrl(e.currentTarget.value)}
				/>

				<Button
					onClick={getSignature}
					className="gap-4"
					disabled={isGettingSignature}
				>
					{isGettingSignature && <Refresh className="animate-spin" />} Get
					Signature
				</Button>
			</div>

			<Card className="relative mb-10 w-full max-w-none overflow-auto bg-slate-200">
				<div className="flex items-end justify-between">
					<Title
						size="md"
						className="sticky left-0 top-0 inline-block rounded bg-blue-700 px-2 text-slate-200"
					>
						Linkus State
					</Title>

					<Button
						title="Copy signature"
						onClick={copySignatureToClipboard}
						className="sticky right-0 top-0"
					>
						<Copy />
					</Button>
				</div>

				<pre className="mt-4">{echo({ signature, signatureError })}</pre>
			</Card>
		</section>
	);
}

export function CallSetupUI() {
	const [signature, setSignature] = useState("");
	const [username, setUsername] = useState("");

	const [phone, setPhone] = useState<PhoneOperator>();
	const [pbx, setPBX] = useState<PBXOperator>();
	const [destroy, setDestroy] = useState<() => void>();

	const [callId, setCallId] = useState<string>("");
	const [sessions, setSessions] = useState<Session[]>([]);
	const [incomings, setIncoming] = useState<Session[]>([]);
	const [cause, setCause] = useState<string>("");

	const startLinkus = useCallback(() => {
		initLinkus(
			{ secret: signature, username },
			{
				beforeStart(phone) {
					// phone.on();
				},
				afterStart(phone, pbx, destroy) {
					setPhone(phone);
					setPBX(pbx);
					// setDestroy(destroy);
				},
			},
		);
	}, [signature, username]);

	useEffect(() => {
		if (!phone) return;
		// listen startSession event and show ui.
		const startSession = ({
			callId,
			session,
		}: {
			callId: any;
			session: any;
		}) => {
			setCallId(callId);
			setSessions(Array.from(phone.sessions.values()));
		};

		const deleteSession = ({ callId, cause }: { callId: any; cause: any }) => {
			// here can handle session deleted event.
			setCause(cause);
			setSessions(Array.from(phone.sessions.values()));
		};
		const incoming = ({ callId, session }: { callId: any; session: any }) => {
			// This example disabled call waiting, only handle one call.
			// So here just handle one incoming call.
			setIncoming([session]);
		};
		phone.on("startSession", startSession);
		phone.on("deleteSession", deleteSession);
		phone.on("incoming", incoming);
		return () => {
			phone.removeListener("startSession", startSession);
			phone.removeListener("deleteSession", deleteSession);
			phone.removeListener("incoming", incoming);
		};
	}, [phone]);

	return (
		<section className="grid grid-cols-2 gap-4">
			<article className="col-span-2">
				<Card className="mx-auto flex max-w-lg flex-col gap-2">
					<Input
						label="Signature"
						value={signature}
						onChange={(e) => setSignature(e.currentTarget.value)}
					/>
					<Input
						label="Username"
						value={username}
						onChange={(e) => setUsername(e.currentTarget.value)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<Button
							className="bg-red-500 hover:bg-red-600"
							onClick={() => destroy && destroy()}
						>
							Stop Linkus <Square />
						</Button>
						<Button
							className="bg-emerald-500 hover:bg-emerald-600"
							onClick={() => startLinkus()}
						>
							Start Linkus <Play />
						</Button>
					</div>
				</Card>
			</article>

			<div>
				<DialPad onCall={(number) => phone?.call(number)} />
			</div>

			<div className="flex flex-col gap-4">
				{sessions.map((session) => {
					return (
						<CallInProgress
							key={`${session.status.callId}_${session.status.callStatus}`}
							title={session.status.number}
							session={session}
						/>
					);
				})}
			</div>

			<div className="col-span-2 flex flex-col gap-4">
				<Title size="md">Incoming Calls</Title>

				{incomings.map((session) => (
					<IncomingCall
						key={session.status.callId}
						session={session}
						handler={() => setIncoming([])}
					/>
				))}
			</div>
		</section>
	);
}
