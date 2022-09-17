import { Injectable } from '@angular/core';

export interface BadgeItem {
    type: string;
    value: string;
}
export interface Saperator {
    name: string;
    type?: string;
}
export interface SubChildren {
    state: string;
    name: string;
    type?: string;
}
export interface ChildrenItems {
    state: string;
    name: string;
    type?: string;
    child?: SubChildren[];
}

export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    saperator?: Saperator[];
    children?: ChildrenItems[];
}

const MENUITEMS = [
    {
        state: '',
        name: 'Personal',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        state: 'dashboards',
        name: 'Dashboards',
        type: 'sub',
        icon: 'av_timer',
        children: [
            { state: 'dashboard1', name: 'Dashboard 1', type: 'link' },
            { state: 'dashboard2', name: 'Dashboard 2', type: 'link' }
        ]
    },
    {
        state: 'apps',
        name: 'Apps',
        type: 'sub',
        icon: 'apps',
        badge: [{ type: 'warning', value: 'new' }],
        children: [
            { state: 'calendar', name: 'Calendar', type: 'link' },
            { state: 'mailbox', name: 'Mailbox', type: 'link' },
            { state: 'messages', name: 'Mail', type: 'link' },
            { state: 'chat', name: 'Chat', type: 'link' },
            { state: 'taskboard', name: 'Taskboard', type: 'link' },
            { state: 'notes', name: 'Notes', type: 'link' },

            { state: 'employeelist', name: 'Employees', type: 'link' },

            { state: 'courses', name: 'Courses', type: 'link' },
            { state: 'contact', name: 'Contact', type: 'link' },

            { state: 'ticketlist', name: 'Ticket List', type: 'link' },

            { state: 'ticketdetails', name: 'Ticket Details', type: 'link' },

            { state: 'invoice', name: 'Invoice', type: 'link' },
            { state: 'todo', name: 'Todo', type: 'link' },
        ]
    },
    {
        state: '',
        name: 'Extra Component',
        type: 'saperator',
        icon: 'av_timer'
    },
    {
        state: 'authentication',
        name: 'Authentication',
        type: 'sub',
        icon: 'perm_contact_calendar',
        children: [
            { state: 'login', name: 'Login', type: 'link' },
            { state: 'register', name: 'Register', type: 'link' },
            { state: 'forgot', name: 'Forgot', type: 'link' },
            { state: 'lockscreen', name: 'Lockscreen', type: 'link' },
            { state: '404', name: 'Error', type: 'link' }
        ]
    },
    {
        state: 'pages',
        name: 'Pages',
        type: 'sub',
        icon: 'content_copy',
        children: [
            { state: 'timeline', name: 'Timeline', type: 'link' },
            { state: 'invoice', name: 'Invoice', type: 'link' },
            { state: 'pricing', name: 'Pricing', type: 'link' },
            { state: 'helper', name: 'Helper Classes', type: 'link' },
            {
                state: 'icons',
                name: 'Icons',
                type: 'subchild',
                subchildren: [
                    {
                        state: 'material',
                        name: 'Material Icons',
                        type: 'link'
                    }
                ]
            }
        ]
    }
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}
