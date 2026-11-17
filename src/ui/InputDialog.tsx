import { useEffect, useRef, useState } from "react";

export interface InputRequest { message: string; type: "string" | "int" | "float"; resolve: (value: string) => void }
export function InputDialog({ request, onClose }: { request?: InputRequest; onClose: (value: string) => void }): React.JSX.Element | null {
  const [value, setValue] = useState(""); const field = useRef<HTMLInputElement>(null);
  useEffect(() => { setValue(""); field.current?.focus(); }, [request]);
  if (!request) return null;
  return <div className="input-backdrop" role="presentation"><form className="input-dialog" aria-modal="true" aria-labelledby="input-title" role="dialog" onSubmit={(event) => { event.preventDefault(); onClose(value); }}><h2 id="input-title">Entrada CORAPRI</h2><p>{request.message || "Introduce un valor:"}</p><label>Valor<input ref={field} value={value} onChange={(event) => setValue(event.target.value)} type={request.type === "string" ? "text" : "number"} step={request.type === "int" ? "1" : "any"} /></label><div><button type="button" onClick={() => onClose("")}>Cancelar</button><button className="run" type="submit">Aceptar</button></div></form></div>;
}
