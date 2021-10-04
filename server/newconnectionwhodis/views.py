from rest_framework import viewsets
from rest_framework.response import Response

from django.http import Http404

from . import serializers
from . import models

def paginate_queryset(query_params, queryset):
    """
    Utility function to slice a queryset if pagination parameters
    'page' and 'size' are provided.
    """
    num_models = len(queryset)
    # slicing empty or singleton querysets does not return queryset.
    if num_models <= 1:
        return queryset
    page = query_params.get('page')
    size = query_params.get('size')
    page = int(page) - 1 if page else 0
    size = int(size) if size else num_models
    return queryset[page * size : page * size + size]

class AuthorsViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({
            'type': "authors",
            'items': serializers.AuthorSerializer(
                paginate_queryset(
                    self.request.query_params,
                    models.Author.objects.all()),
                context={'request': request},
                many=True).data})

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = models.Author.objects.all().order_by('displayName')
    serializer_class = serializers.AuthorSerializer
    def list(self, request, *args, **kwargs):
        return Http404("Cannot list author")

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PostSerializer
    def get_queryset(self):
        return models.Post.objects.filter(
            author=self.kwargs['author_pk'])
    def perform_create(self, serializer):
        author_pk = self.kwargs['author_pk']
        author = models.Author.objects.filter(pk=author_pk).get()
        serializer.save(author=author)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CommentSerializer
    def get_queryset(self):
        return paginate_queryset(
            self.request.query_params,
            models.Comment.objects.order_by('-published').filter(
                author=self.kwargs['author_pk'],
                post=self.kwargs['posts_pk']))