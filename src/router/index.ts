import { createRouter, createWebHistory } from 'vue-router'
import LoginViewVue from '@/apps/auth/presentation/views/LoginView.vue'
import DashboardBaseViewVue from '@/apps/admin/presentation/views/BaseDashboardView.vue'
import EditInventoryItemViewVue from '@/apps/admin/presentation/views/EditInventoryItemView.vue'
import ListInventoryViewVue from '@/apps/admin/presentation/views/ListInventoryView.vue'
import TransactInventoryItemViewVue from '@/apps/admin/presentation/views/TransactInventoryItemView.vue'
import EditProductItemViewVue from '@/apps/admin/presentation/views/EditProductItemView.vue'
import ListProductViewVue from '@/apps/admin/presentation/views/ListProductView.vue'
import CashierViewVue from '@/apps/cashier/presentation/views/CashierView.vue'
import SellViewVue from '@/apps/cashier/presentation/views/SellView.vue'
import ProduceViewVue from '@/apps/cashier/presentation/views/ProduceView.vue'
import ReportViewVue from '@/apps/admin/presentation/views/ReportView.vue'
import DashboardViewVue from '@/apps/admin/presentation/views/DashboardView.vue'
import SplashViewVue from '@/apps/admin/presentation/views/SplashView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "splash",
      component: SplashViewVue
    },
    {
      path: "/auth/login",
      name: "login",
      component: LoginViewVue
    },
    {
      path: "/admin",
      name: "admin",
      component: DashboardBaseViewVue,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: DashboardViewVue
        },
        {
          path: "inventory/list",
          name: "List Inventory",
          component: ListInventoryViewVue
        },
        {
          path: "inventory/transact",
          name: "Trasact Inventory",
          component: TransactInventoryItemViewVue
        },
        {
          path: "inventory/edit",
          name: "Edit Inventory",
          component: EditInventoryItemViewVue
        },

        {
          path: "product/list",
          name: "List Product",
          component: ListProductViewVue
        },
        {
          path: "product/edit",
          name: "Edit Product",
          component: EditProductItemViewVue
        },
        {
          path: "report",
          name: "Report",
          component: ReportViewVue
        }
      ]
    },
    {
      path: "/cashier",
      name: "cashier",
      component: CashierViewVue,
      children: [
        {
          path: "sell",
          name: "Sell",
          component: SellViewVue
        },
        {
          path: "produce",
          name: "Produce",
          component: ProduceViewVue
        }
      ]
    }
  ]
})

export default router
