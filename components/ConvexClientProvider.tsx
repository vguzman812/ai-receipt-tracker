"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useUser } from "@clerk/nextjs";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
import {
  SchematicProvider,
  useSchematicEvents,
} from "@schematichq/schematic-react";

// https://docs.schematichq.com/developer_resources/sdks/react
const SchematicWrapped = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const { identify } = useSchematicEvents();

  useEffect(() => {
    const userName =
      user?.username ||
      user?.firstName ||
      user?.emailAddresses[0].emailAddress ||
      user?.id;

    if (user?.id) {
      identify({
        name: userName,
        keys: {
          id: user.id,
        },
        company: {
          keys: {
            id: user.id,
          },
          name: userName,
        },
      });
    }
  }, [user]);

  return children;
};

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <SchematicProvider
        publishableKey={process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY!}
      >
        <SchematicWrapped>{children}</SchematicWrapped>
      </SchematicProvider>
    </ConvexProviderWithClerk>
  );
}
