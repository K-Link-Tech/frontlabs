import { Phone, PhoneOutcome, PhonePaused, PhoneXmark } from "iconoir-react";
import { ReactNode, useState } from "react";
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
  callInfo?: ReactNode;
  disabledControls?: boolean;
  onHold?: () => void;
  onHangup?: () => void;
}
export function CallInProgress({
  callInfo,
  disabledControls = false,
  onHold,
  onHangup,
}: CallInProgressProps) {
  return (
    <Card className="flex flex-col gap-4">
      <Title size="md">Call In-Progress</Title>

      <fieldset disabled={disabledControls} className="flex flex-wrap gap-4">
        <Button
          title="Hold Call"
          onClick={() => onHold && onHold()}
          className="bg-slate-700 hover:bg-slate-800"
        >
          <PhonePaused />
        </Button>

        <Button
          title="Hangup"
          onClick={() => onHangup && onHangup()}
          className="bg-red-700 hover:bg-red-800"
        >
          <PhoneXmark />
        </Button>
      </fieldset>

      <article className="font-mono text-sm">{callInfo}</article>
    </Card>
  );
}

// ////////////////////////////////////////
// Incoming Call
// ////////////////////////////////////////
interface IncomingCallProps {
  title?: string;
  callInfo?: ReactNode;
  onReject?: () => void;
  onAccept?: () => void;
}
export function IncomingCall({
  title,
  callInfo,
  onReject,
  onAccept,
}: IncomingCallProps) {
  return (
    <Card>
      {title && <Title size="md">{title}</Title>}

      <div className="flex items-start gap-4">
        <article className="flex justify-end gap-4">
          <Button
            title="Reject Call"
            onClick={() => onReject && onReject()}
            className="bg-red-700 hover:bg-red-800"
          >
            <PhoneXmark />
          </Button>

          <Button
            title="Accept Call"
            onClick={() => onAccept && onAccept()}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            <Phone />
          </Button>
        </article>

        <article className="font-mono text-sm">{callInfo}</article>
      </div>
    </Card>
  );
}
