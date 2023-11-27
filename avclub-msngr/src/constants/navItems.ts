import { NavItem } from "../types/types";

export const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Teams',
        children: [
            {
                label: 'View Teams',
                subLabel: 'View Your Teams',
                href: '#',
            },
            {
                label: 'Create New Team',
                subLabel: 'Start a New Team',
                href: '#',
            },
        ],
    },
    {
        label: 'Chats',
        children: [
            {
                label: 'View Chats',
                subLabel: 'View Chats You Participate in',
                href: '#',
            },
            {
                label: 'Start a New Chat',
                subLabel: 'Search for Users and Start a Chat With Them',
                href: '#',
            },
        ],
    },
    {
        label: 'Profile',
        href: '#',
    },
]