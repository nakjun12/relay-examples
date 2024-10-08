import * as React from "react";
import { useState, useTransition } from "react";
import { useRefetchableFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Card from "./Card";
import ContactRow from "./ContactRow";
import SearchInput from "./SearchInput";
import type { ContactsListFragment$key } from "./__generated__/ContactsListFragment.graphql";

export type Props = {
  viewer: ContactsListFragment$key;
};

const ContactsListFragment = graphql`
  fragment ContactsListFragment on Viewer
  @refetchable(queryName: "ContactsListRefetchQuery")
  @argumentDefinitions(search: { type: "String", defaultValue: null }) {
    contacts(search: $search) {
      id
      ...ContactRowFragment
    }
  }
`;

export default function ContactsList({ viewer }: Props) {
  const [data, refetch] = useRefetchableFragment(ContactsListFragment, viewer);
  const [isPending, startTransition] = useTransition();
  const [searchString, setSearchString] = useState("");
  const onSearchStringChanged = (value: string) => {
    setSearchString(value);
    startTransition(() => {
      refetch({ search: value });
    });
  };
  return (
    <Card dim={true}>
      <h3>Contacts</h3>
      <SearchInput
        value={searchString}
        onChange={onSearchStringChanged}
        isPending={isPending}
      />
      {data.contacts.map((contact) => (
        <ContactRow key={contact.id} contact={contact} />
      ))}
    </Card>
  );
}
