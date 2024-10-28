import type { Invoice } from "@/apps/core/data/models/invoice";
import BaseState, { AsyncState } from "@/common/state/baseState";




export default class InvoiceListState extends BaseState{

    invoices?: Invoice[];

}