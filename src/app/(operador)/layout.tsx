import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operator",
};
export default function OperadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
