import { Card } from "@/components/Base/Card";
import { Title } from "@/components/Base/Title";
import { CallInProgress, DialPad, IncomingCall } from "@/components/Telephone";
import { yeastar } from "@/credentials";
import { echo } from "@/utils";
import { GetYeastarSignature } from "@/utils/yeastar-handshake";
import { useEffect, useRef, useState } from "react";

export default function PageYeastar() {
	const signatureCount = useRef(0);
	const [signature, setSignature] = useState("");
	const [signatureError, setSignatureError] = useState("");

	useEffect(() => {
		if (signatureCount.current > 0) return;

		signatureCount.current = 1;
		const signature = new GetYeastarSignature({
			AccessID: yeastar.AccessID,
			AccessKey: yeastar.AccessKey,
			apiUrl: yeastar.BaseURL,
			username: yeastar.Username,
		});
		signature
			.handshake()
			.then((result) => {
				if (result.errmsg === "SUCCESS") {
					setSignature(result.data.sign ?? "");
				}
				if (result.errmsg === "FAILURE") {
					setSignatureError(result.errcode.toString());
				}
			})
			.catch((err) => {
				console.error(err);
				alert(
					"Signature Handshake Error! Check developer console for more details.",
				);
			});
	}, []);

	// useEffect(() => {
	//   if (signature.length <= 0) return;

	//   initLinkus(
	//     { secret: signature, username: yeastar.Username },
	//     {
	//       phone_beforeStart(phone) {

	//       },
	//     },
	//   );

	// }, [signature]);

	return (
		<main className="mx-auto max-w-5xl p-8">
			<Title className="mb-16">Linkus SDK</Title>

			<Card className="relative mb-10 w-full max-w-none overflow-auto bg-slate-200">
				<Title
					size="md"
					className="sticky left-0 top-0 inline-block rounded bg-blue-700 px-2 text-slate-200"
				>
					Linkus State
				</Title>

				<pre className="mt-4">{echo({ signature, signatureError })}</pre>
			</Card>

			<article className="flex flex-col gap-10">
				<section className="grid grid-cols-2 gap-6">
					<DialPad />
					<CallInProgress callInfo={<pre>{echo({ phNo: "mg mg" })}</pre>} />
				</section>

				<section className="flex flex-col gap-4">
					<Title size="md">Calls Incoming</Title>

					<IncomingCall callInfo={<pre>{echo({ phNo: "testing" })}</pre>} />
				</section>
			</article>
		</main>
	);
}
