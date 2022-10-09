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
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'dashboard',
    },
    {
        /* state: 'administracion' */
        state: 'admin',
        name: 'Administración',
        type: 'sub',
        icon: 'settings',
        children: [
            { /* state: 'usuarios' */ state: 'users', name: 'Usuarios', type: 'link' }
        ]
    },
    {
       /*  state: 'catalogos' */
        state: 'catalogs',
        name: 'Catálogos',
        type: 'sub',
        icon: 'apps',
        children: [
            { /* state: 'clientes' */ state: 'clients', name: 'Clientes', type: 'link' },
            { /* state: 'productos' */  state: 'products', name: 'Productos', type: 'link' },
            { /* state: 'tipos_productos' */ state: 'typeOfProducts', name: 'Tipos de producto', type: 'link' },
        ]
    },
    {
        state: 'sales',
        name: 'Ventas',
        type: 'link',
        icon: 'add_shopping_cart',
    },
    {
        /* state: 'pedidos' */
        state: 'orders',
        name: 'Pedidos',
        type: 'sub',
        icon: 'shopping_bag',
        children: [
            { /* state: 'generar_pedido' */ state: 'generateOrder', name: 'Generar pedido', type: 'link' },
            { /* state: 'agenda' */ state: 'schedule', name: 'Agenda', type: 'link' },
        ]
    },
    {
        state: 'production',
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
