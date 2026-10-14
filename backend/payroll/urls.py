from django.urls import path

from .views import (
    SalaryStructureListCreateView,
    SalaryStructureDetailView,
    SalarySlipListCreateView,
    SalarySlipDetailView,
    SalarySlipApproveView,
    SalarySlipPayView,
    MySalarySlipView,
    PayrollEmployeeListView,
    EmployeeBankDetailsListCreateView,
    EmployeeBankDetailsDetailView,
)


urlpatterns = [

    # =====================================================
    # SALARY STRUCTURE
    # =====================================================


    path(
    "employees/",
    PayrollEmployeeListView.as_view(),
    name="payroll-employees",
    ),

    path(
    "bank-details/",
    EmployeeBankDetailsListCreateView.as_view(),
    name="employee-bank-details",
),
path(
    "bank-details/<int:pk>/",
    EmployeeBankDetailsDetailView.as_view(),
    name="employee-bank-details-detail",
),

    path(
        "salary-structures/",
        SalaryStructureListCreateView.as_view(),
        name="salary-structure-list-create",
    ),

    path(
        "salary-structures/<int:pk>/",
        SalaryStructureDetailView.as_view(),
        name="salary-structure-detail",
    ),


    # =====================================================
    # SALARY SLIPS
    # =====================================================

    path(
        "salary-slips/",
        SalarySlipListCreateView.as_view(),
        name="salary-slip-list-create",
    ),

    path(
        "salary-slips/<int:pk>/",
        SalarySlipDetailView.as_view(),
        name="salary-slip-detail",
    ),


    # =====================================================
    # APPROVE SALARY
    # =====================================================

    path(
        "salary-slips/<int:pk>/approve/",
        SalarySlipApproveView.as_view(),
        name="salary-slip-approve",
    ),


    # =====================================================
    # PAY SALARY
    # =====================================================

    path(
        "salary-slips/<int:pk>/pay/",
        SalarySlipPayView.as_view(),
        name="salary-slip-pay",
    ),


    # =====================================================
    # MY SALARY
    # =====================================================

    path(
        "my-salary/",
        MySalarySlipView.as_view(),
        name="my-salary",
    ),
    


    
]