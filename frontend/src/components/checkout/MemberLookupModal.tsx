"use client";

import { useState } from "react";

type Member = {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    status: string;
    canChargeToAccount: boolean;
};

type MemberLookupModalProps = {
    total: number;
    onClose: () => void;
    onConfirmCharge: (member: Member) => void;
};

export default function MemberLookupModal({
    total,
    onClose,
    onConfirmCharge,
}: MemberLookupModalProps) {
    const [query, setQuery] = useState("");
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    async function handleSearch() {
        if (!query.trim()) return;

        try {
            setIsSearching(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/members/search?query=${encodeURIComponent(
                    query
                )}`
            );

            const data = await response.json();
            setMembers(data.members ?? data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    }

    const canCharge =
        selectedMember?.status === "ACTIVE" &&
        selectedMember?.canChargeToAccount;

    return (
        <div className="modal-backdrop">
            <div className="custom-discount-modal member-lookup-modal">
                <h2>Member Lookup</h2>

                <p className="modal-subtitle">
                    Search for a member before charging ${total.toFixed(2)} to
                    their account.
                </p>

                <div className="member-search-row">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") handleSearch();
                        }}
                        placeholder="Search name, email, or member ID"
                        autoFocus
                    />

                    <button onClick={handleSearch} disabled={isSearching}>
                        {isSearching ? "Searching..." : "Search"}
                    </button>
                </div>

                <div className="member-results">
                    {members.map((member) => (
                        <button
                            key={member.id}
                            className={`member-result ${selectedMember?.id === member.id ? "active" : ""
                                }`}
                            onClick={() => setSelectedMember(member)}
                        >
                            <div>
                                <strong>
                                    {member.firstName} {member.lastName}
                                </strong>

                                <span>{member.email || "No email"}</span>
                            </div>

                            <small>
                                {member.status}
                                {member.canChargeToAccount
                                    ? " • Can charge"
                                    : " • Cannot charge"}
                            </small>
                        </button>
                    ))}
                </div>

                {selectedMember && !canCharge && (
                    <p className="member-warning">
                        This member cannot be charged to account.
                    </p>
                )}

                <div className="modal-actions">
                    <button className="modal-secondary-button" onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        className="modal-primary-button"
                        disabled={!canCharge}
                        onClick={() => {
                            if (selectedMember) {
                                onConfirmCharge(selectedMember);
                            }
                        }}
                    >
                        Charge ${total.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
}