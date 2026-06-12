"""
Script to initialize database with roles, permissions, and sample data
Run with: python manage.py shell < init_db.py
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tpizza_backend.settings')
django.setup()

from core.models import Role, Permission, CustomUser, Branch, Table, Booking
from django.contrib.auth.hashers import make_password
from datetime import datetime, timedelta

print("=" * 60)
print("Initializing Database with Roles, Permissions, and Data")
print("=" * 60)

# Create Roles
print("\n1. Creating Roles...")
roles_data = [
    ('admin', 'Admin'),
    ('staff', 'Staff'),
    ('customer', 'Customer'),
]

roles = {}
for name, display in roles_data:
    role, created = Role.objects.get_or_create(name=name)
    roles[name] = role
    if created:
        print(f"   ✓ Created role: {display}")
    else:
        print(f"   - Role already exists: {display}")

# Create Permissions
print("\n2. Creating Permissions...")
permissions_data = {
    'admin': [
        'view_bookings', 'create_booking', 'edit_booking', 'delete_booking',
        'view_branches', 'manage_branches', 'view_tables', 'manage_tables',
        'manage_users', 'view_statistics'
    ],
    'staff': [
        'view_bookings', 'edit_booking', 'view_branches', 'view_tables',
        'manage_tables', 'view_statistics'
    ],
    'customer': [
        'view_bookings', 'create_booking', 'edit_booking'
    ],
}

for role_name, perms in permissions_data.items():
    role = roles[role_name]
    for perm in perms:
        permission, created = Permission.objects.get_or_create(
            role=role,
            permission=perm
        )
        if created:
            print(f"   ✓ Created permission: {role_name} - {perm}")

# Create Admin User
print("\n3. Creating Admin User...")
admin_user, created = CustomUser.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@tpizza.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'phone': '0908888888',
        'role': roles['admin'],
        'is_staff': True,
        'is_superuser': True,
    }
)
if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print("   ✓ Created admin user (username: admin, password: admin123)")
else:
    print("   - Admin user already exists")

# Create Sample Branches
print("\n4. Creating Sample Branches...")
branches_data = [
    {
        'name': "T'Pizza Hai Bà Trưng",
        'location': 'Hồ Chí Minh',
        'address': '180 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. HCM',
        'phone': '028 3622 0500',
        'email': 'haibatro.tpizza@email.com',
        'description': 'Chi nhánh trung tâm cổ kính, trang nhã. Có quầy bar dài lãng mạn và hai lò nướng củi trung tâm rực lửa thích hợp cho gia đình hoặc hẹn hò.',
        'image_url': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        'rating': 4.8,
        'status': 'active',
        'latitude': 10.7828,
        'longitude': 106.6958,
    },
    {
        'name': "T'Pizza Võ Văn Tần",
        'location': 'Hồ Chí Minh',
        'address': '31 Võ Văn Tần, Phường 6, Quận 3, TP. HCM',
        'phone': '028 3622 0501',
        'email': 'voivantan.tpizza@email.com',
        'description': 'Phong cách sân vườn biệt thự Đông Dương cũ. Không gian ngoài trời ngập tràn bóng mát cây xanh, mang đến bầu không khí thư thái tĩnh lặng.',
        'image_url': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'rating': 4.9,
        'status': 'active',
        'latitude': 10.7785,
        'longitude': 106.6908,
    },
    {
        'name': "T'Pizza Lý Quốc Sư",
        'location': 'Hà Nội',
        'address': '2 Lý Quốc Sư, Hàng Trống, Hoàn Kiếm, Hà Nội',
        'phone': '024 3622 0502',
        'email': 'lyquocsu.tpizza@email.com',
        'description': 'Nằm ngay sát Nhà Thờ Lớn cổ kính. Không gian gác mái ấm cúng với gạch mộc và dầm gỗ tự nhiên mang đậm hơi thở Hà Nội xưa.',
        'image_url': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
        'rating': 4.7,
        'status': 'active',
        'latitude': 21.0289,
        'longitude': 105.8488,
    },
    {
        'name': "T'Pizza Phan Chu Trinh",
        'location': 'Hà Nội',
        'address': '43 Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
        'phone': '024 3622 0503',
        'email': 'phanchutrihnh.tpizza@email.com',
        'description': 'Không gian mở 2 tầng rộng lớn, phong cách Tây Âu kết hợp tối giản Nhật Bản. Nơi lý tưởng để tổ chức các buổi tiệc đông người.',
        'image_url': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
        'rating': 4.8,
        'status': 'busy',
        'latitude': 21.0215,
        'longitude': 105.8562,
    },
    {
        'name': "T'Pizza Bạch Đằng",
        'location': 'Đà Nẵng',
        'address': '214 Bạch Đằng, Phước Ninh, Hải Châu, Đà Nẵng',
        'phone': '0236 3622 0504',
        'email': 'bachdang.tpizza@email.com',
        'description': 'Ôm trọn tầm nhìn ra Sông Hàn và Cầu Rồng thơ mộng. Khu vực seating ngoài trời lộng gió thích hợp ngắm hoàng hôn và nhâm nhi bia thủ công.',
        'image_url': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        'rating': 4.9,
        'status': 'active',
        'latitude': 16.0664,
        'longitude': 108.2238,
    },
    {
        'name': "T'Pizza Điện Biên Phủ",
        'location': 'Hải Phòng',
        'address': '15 Điện Biên Phủ, Máy Tơ, Ngô Quyền, Hải Phòng',
        'phone': '0225 3622 0505',
        'email': 'dienbienphu.tpizza@email.com',
        'description': 'Thiết kế cải tạo từ một nhà kho hải cảng cũ, kiến trúc thô mộc Industrial đầy cuốn hút kết hợp cây xanh dây leo độc đáo.',
        'image_url': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        'rating': 4.6,
        'status': 'active',
        'latitude': 20.8654,
        'longitude': 106.6892,
    },
]

branches = {}
for branch_data in branches_data:
    branch, created = Branch.objects.get_or_create(
        name=branch_data['name'],
        defaults=branch_data
    )
    branches[branch.id] = branch
    if created:
        print(f"   ✓ Created branch: {branch.name}")
    else:
        print(f"   - Branch already exists: {branch.name}")

# Create Tables for each branch
print("\n5. Creating Tables for each Branch...")
zones = [
    ('indoor', 'Trong nhà'),
    ('outdoor', 'Ngoài trời'),
    ('mezzanine', 'Quầy tầng lửng'),
    ('kiln', 'Cạnh lò củi'),
]

table_config = [
    (2, 2), (2, 3), (2, 4), (2, 5),
    (4, 2), (4, 3), (4, 4),
    (6, 2), (6, 3),
    (8, 1), (8, 1),
    (10, 1), (10, 1),
]

for branch in branches.values():
    existing_tables = branch.tables.count()
    if existing_tables == 0:
        table_num = 1
        for capacity, count_per_zone in table_config:
            for zone, zone_display in zones:
                for i in range(count_per_zone):
                    table, created = Table.objects.get_or_create(
                        branch=branch,
                        table_number=f"{table_num}",
                        defaults={
                            'capacity': capacity,
                            'zone': zone,
                            'is_available': True,
                        }
                    )
                    table_num += 1
        print(f"   ✓ Created tables for branch: {branch.name}")
    else:
        print(f"   - Branch {branch.name} already has {existing_tables} tables")

# Create Sample Staff Users
print("\n6. Creating Sample Staff Users...")
for i, (branch_id, branch) in enumerate(list(branches.items())[:2]):
    staff_user, created = CustomUser.objects.get_or_create(
        username=f'staff_{i+1}',
        defaults={
            'email': f'staff{i+1}@tpizza.com',
            'first_name': f'Staff',
            'last_name': f'{i+1}',
            'phone': f'090777{1000+i}',
            'role': roles['staff'],
        }
    )
    if created:
        staff_user.set_password('staff123')
        staff_user.save()
        print(f"   ✓ Created staff user: staff_{i+1}")

# Create Sample Customers
print("\n7. Creating Sample Customers...")
for i in range(3):
    customer_user, created = CustomUser.objects.get_or_create(
        username=f'customer_{i+1}',
        defaults={
            'email': f'customer{i+1}@email.com',
            'first_name': f'Customer',
            'last_name': f'{i+1}',
            'phone': f'090666{1000+i}',
            'role': roles['customer'],
        }
    )
    if created:
        customer_user.set_password('customer123')
        customer_user.save()
        print(f"   ✓ Created customer user: customer_{i+1}")

# Create Sample Bookings
print("\n8. Creating Sample Bookings...")
customer_users = CustomUser.objects.filter(role=roles['customer'])
branches_list = list(branches.values())

times = ['11:00', '11:30', '12:00', '12:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30']
zones = ['indoor', 'outdoor', 'mezzanine', 'kiln']

booking_count = 0
for i, customer in enumerate(customer_users):
    for j in range(3):
        branch = branches_list[j % len(branches_list)]
        booking_date = (datetime.now() + timedelta(days=j+1)).date()
        booking_time = times[(i*3+j) % len(times)]
        
        from django.db.models.fields.related import ForeignKey
        booking, created = Booking.objects.get_or_create(
            customer=customer,
            branch=branch,
            booking_date=booking_date,
            booking_time=booking_time,
            defaults={
                'adult_count': (i + 2) % 5 + 2,
                'children_count': i % 3,
                'zone_preference': zones[(i + j) % len(zones)],
                'status': ['pending', 'confirmed', 'confirmed'][i % 3],
            }
        )
        if created:
            booking_count += 1

print(f"   ✓ Created {booking_count} sample bookings")

print("\n" + "=" * 60)
print("Database initialization completed successfully!")
print("=" * 60)
print("\nYou can now log in with:")
print("  Admin: admin / admin123")
print("  Staff: staff_1 / staff123")
print("  Customer: customer_1 / customer123")
