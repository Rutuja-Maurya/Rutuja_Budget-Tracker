from rest_framework import viewsets, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import date
from datetime import datetime, timedelta
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer
from .models import Category, Transaction, Budget
from django_filters.rest_framework import DjangoFilterBackend

# Category API
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Transaction API
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['category', 'date', 'amount']  # add more as needed
    ordering_fields = ['date', 'amount']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
# class TransactionViewSet(viewsets.ModelViewSet):
#     serializer_class = TransactionSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Transaction.objects.filter(user=self.request.user).order_by('-date', '-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
# Budget API
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user).order_by('-month')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
# class SummaryAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         today = date.today()
#         month_start = today.replace(day=1)

#         # Transactions for the current month
#         transactions = Transaction.objects.filter(user=user, date__gte=month_start, date__lte=today)
#         income = transactions.filter(category__type='income').aggregate(total=Sum('amount'))['total'] or 0
#         expenses = transactions.filter(category__type='expense').aggregate(total=Sum('amount'))['total'] or 0
#         balance = income - expenses

#         # Budget for the current month
#         budget_obj = Budget.objects.filter(user=user, year=today.year, month=today.month).first()
#         budget = budget_obj.amount if budget_obj else 0
#         budget_remaining = budget - expenses

#         return Response({
#             'income': income,
#             'expenses': expenses,
#             'balance': balance,
#             'budget': budget,
#             'budget_remaining': budget_remaining,
#         })
class SummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        month_str = request.GET.get('month')  # e.g., '2025-06'
        if month_str:
            year, month = map(int, month_str.split('-'))
            month_start = datetime(year, month, 1).date()
            if month == 12:
                next_month_start = datetime(year + 1, 1, 1).date()
            else:
                next_month_start = datetime(year, month + 1, 1).date()
        else:
            today = date.today()
            month_start = today.replace(day=1)
            if today.month == 12:
                next_month_start = today.replace(year=today.year + 1, month=1, day=1)
            else:
                next_month_start = today.replace(month=today.month + 1, day=1)

        transactions = Transaction.objects.filter(
            user=user,
            date__gte=month_start,
            date__lt=next_month_start
        )
        income = transactions.filter(category__type='income').aggregate(total=Sum('amount'))['total'] or 0
        expenses = transactions.filter(category__type='expense').aggregate(total=Sum('amount'))['total'] or 0
        balance = income - expenses

        budget_obj = Budget.objects.filter(user=user, year=month_start.year, month=month_start.month).first()
        budget = budget_obj.amount if budget_obj else 0
        budget_remaining = budget - expenses

        return Response({
            'expenses': expenses,
            'balance': balance,
            'budget': budget,
            'budget_remaining': budget_remaining,
        })
    
class ExpensesByCategoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        month_str = request.GET.get('month')
        if month_str:
            year, month = map(int, month_str.split('-'))
            month_start = datetime(year, month, 1).date()
            if month == 12:
                next_month_start = datetime(year + 1, 1, 1).date()
            else:
                next_month_start = datetime(year, month + 1, 1).date()
        else:
            today = datetime.today().date()
            month_start = today.replace(day=1)
            if today.month == 12:
                next_month_start = today.replace(year=today.year + 1, month=1, day=1)
            else:
                next_month_start = today.replace(month=today.month + 1, day=1)

        data = (
            Transaction.objects
            .filter(user=user, date__gte=month_start, date__lt=next_month_start, category__type='expense')
            .values('category__name')
            .annotate(total=Sum('amount'))
        )
        return Response(list(data))    