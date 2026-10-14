from django.urls import path

from .views import (
    FeeStructureListCreateView,
    FeeStructureDetailView,
    FeeInvoiceListCreateView,
    FeePaymentListCreateView,
    create_fee_online_order,
    verify_fee_online_payment,
    FeeDashboardView,
    MyFeeInvoiceView,
    MyFeePaymentsView
)


urlpatterns = [

    # -----------------------------------------
    # Fee Structures
    # -----------------------------------------

    path(
        "structures/",
        FeeStructureListCreateView.as_view(),
        name="fee-structure-list-create",
    ),

    path(
        "structures/<int:pk>/",
        FeeStructureDetailView.as_view(),
        name="fee-structure-detail",
    ),

    # -----------------------------------------
    # Fee Invoices
    # -----------------------------------------

    path(
        "invoices/",
        FeeInvoiceListCreateView.as_view(),
        name="fee-invoice-list-create",
    ),

    # -----------------------------------------
    # Offline Payments
    # -----------------------------------------

    path(
        "payments/",
        FeePaymentListCreateView.as_view(),
        name="fee-payment-list-create",
    ),

    # -----------------------------------------
    # Online Payment
    # -----------------------------------------

    path(
        "online-payment/create-order/",
        create_fee_online_order,
        name="create-fee-online-order",
    ),

        path(
        "dashboard/",
        FeeDashboardView.as_view(),
        name="fee-dashboard"
    ),


      # Online Payment - Verify
    path(
        "online-payment/verify/",
        verify_fee_online_payment,
        name="verify-fee-online-payment",
    ),

    path("my-invoice/", MyFeeInvoiceView.as_view(), name="my-fee-invoice"),
path("my-payments/", MyFeePaymentsView.as_view(), name="my-fee-payments"),
]