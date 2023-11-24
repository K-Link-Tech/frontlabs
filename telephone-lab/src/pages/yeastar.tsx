import { Title } from "@/components/Base/Title";
import { CallInProgress, DialPad, IncomingCall } from "@/components/Telephone";
import { echo } from "@/utils";

export default function PageYeastar() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <Title className="mb-16">Linkus SDK</Title>

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
