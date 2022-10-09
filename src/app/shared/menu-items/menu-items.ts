import { getLocaleExtraDayPeriodRules } from '@angular/common';
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
/* Modificacion de los nombres e iconos de la barra lateral, conservando el state por si se llega a necesitar */
const MENUITEMS = [
    {
        /* state: 'administracion' */
        state: 'dashboards',
        name: 'Administración',
        type: 'sub',
        icon: 'settings',
        children: [
            { /* state: 'usuarios' */ state: 'dashboard2', name: 'Usuarios', type: 'link' }
        ]
    },
    {
       /*  state: 'catalogos' */
        state: 'apps',
        name: 'Catálogos',
        type: 'sub',
        icon: 'apps',
        children: [
            { /* state: 'clientes' */ state: 'calendar', name: 'Clientes', type: 'link' },
            { /* state: 'productos' */  state: 'mailbox', name: 'Productos', type: 'link' },
            { /* state: 'tipos_productos' */ state: 'messages', name: 'Tipos de producto', type: 'link' },
        ]
    },
    {
        state: 'ventas',
        name: 'Ventas',
        type: 'link',
        icon: 'add_shopping_cart',
    },
    {
        /* state: 'pedidos' */
        state: 'authentication',
        name: 'Pedidos',
        type: 'sub',
        icon: 'shopping_bag',
        children: [
            { /* state: 'generar_pedido' */ state: 'login', name: 'Generar pedido', type: 'link' },
            { /* state: 'agenda' */ state: 'register', name: 'Agenda', type: 'link' },
        ]
    },
    {
        state: 'produccion',
        name: 'Producción',
        type: 'link',
        icon: 'inventory_2',
    }
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}
