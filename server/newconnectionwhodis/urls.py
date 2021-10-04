from django.urls import include, path
from rest_framework_nested import routers
from . import views

router = routers.SimpleRouter()
router.register(r'authors', views.AuthorsViewSet, basename='authors')
router.register(r'author', views.AuthorViewSet, basename='author')

author_router = routers.NestedSimpleRouter(router, r'author', lookup='author')
author_router.register(r'posts', views.PostViewSet, basename='posts')

posts_router = routers.NestedSimpleRouter(author_router, r'posts', lookup='posts')
posts_router.register(r'comments', views.CommentViewSet, basename='comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(author_router.urls)),
    path('', include(posts_router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]